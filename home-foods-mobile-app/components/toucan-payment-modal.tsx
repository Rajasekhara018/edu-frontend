import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ToucanPaymentPayload, ToucanSdkRawResult, getToucanSdkConfig, toucanHostHtml } from '@/services/payment-sdk';

type ToucanPaymentModalProps = {
  visible: boolean;
  payload: ToucanPaymentPayload | null;
  onResult: (result: ToucanSdkRawResult) => void;
  onClose: () => void;
};

export default function ToucanPaymentModal({
  visible,
  payload,
  onResult,
  onClose,
}: ToucanPaymentModalProps) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const webViewRef = useRef<WebView>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [paymentTriggered, setPaymentTriggered] = useState(false);

  const config = getToucanSdkConfig();
  const html = useMemo(() => toucanHostHtml(config.sdkScriptUrl), [config.sdkScriptUrl]);

  useEffect(() => {
    if (!visible) {
      setSdkReady(false);
      setPaymentTriggered(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !sdkReady || !payload || paymentTriggered) {
      return;
    }
    const js = `window.makeToucanPayment(${JSON.stringify(payload)}); true;`;
    webViewRef.current?.injectJavaScript(js);
    setPaymentTriggered(true);
  }, [visible, sdkReady, payload, paymentTriggered]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const parsed = JSON.parse(event.nativeEvent.data) as
        | { event?: string }
        | ToucanSdkRawResult;
      if ('event' in parsed && parsed.event) {
        if (parsed.event === 'sdk_loaded') {
          setSdkReady(true);
        } else if (parsed.event === 'sdk_load_failed') {
          onResult({ success: false, error: 'Toucan SDK load failed' });
        }
        return;
      }
      if ('success' in parsed) {
        onResult(parsed);
      }
    } catch {
      onResult({ success: false, error: 'Invalid SDK response' });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Toucan Checkout</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </Pressable>
        </View>
        <WebView
          ref={webViewRef}
          source={{ html, baseUrl: 'https://pmt-sdk.testtoucanpay.in/' }}
          javaScriptEnabled
          onMessage={handleMessage}
          originWhitelist={['*']}
          style={styles.webview}
        />
      </View>
    </Modal>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    close: {
      color: palette.primary,
      fontWeight: '600',
    },
    webview: {
      flex: 1,
      backgroundColor: palette.background,
    },
  });
