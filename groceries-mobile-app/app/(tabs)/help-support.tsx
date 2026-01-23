import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ThemePalette } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type SupportTicket = {
  id: string;
  title: string;
  status: 'open' | 'resolved';
  updatedAt: string;
};

const quickTopics = [
  { icon: 'local-shipping', label: 'Track order' },
  { icon: 'undo', label: 'Return & refund' },
  { icon: 'payments', label: 'Payment issues' },
  { icon: 'location-on', label: 'Address updates' },
  { icon: 'inventory-2', label: 'Missing item' },
  { icon: 'support-agent', label: 'Account help' },
];

const tickets: SupportTicket[] = [
  {
    id: 'TCK-22041',
    title: 'Refund for order #406-7749123-1098871',
    status: 'open',
    updatedAt: 'Updated 2 hours ago',
  },
  {
    id: 'TCK-21789',
    title: 'Unable to apply wallet balance',
    status: 'resolved',
    updatedAt: 'Resolved on 12 January 2026',
  },
];

export default function HelpSupportScreen() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={palette.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('help_title')}</Text>
            <Text style={styles.subtitle}>{t('help_subtitle')}</Text>
          </View>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <MaterialIcons name="search" size={18} color={palette.mutedAlt} />
              <TextInput
                placeholder={t('help_search')}
              placeholderTextColor={palette.mutedAlt}
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
          </View>
          <Text style={styles.searchHint}>
            Popular searches: refund status, change address, late delivery
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('quick_help')}</Text>
          <View style={styles.topicGrid}>
            {quickTopics.map((topic) => (
              <Pressable
                key={topic.label}
                style={styles.topicTile}
                onPress={() => setActiveTopic(topic.label)}>
                <View style={styles.topicIcon}>
                  <MaterialIcons
                    name={topic.icon as keyof typeof MaterialIcons.glyphMap}
                    size={18}
                    color={palette.primary}
                  />
                </View>
                <Text style={styles.topicLabel}>{topic.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('recent_tickets')}</Text>
            <Pressable style={styles.inlineButton} onPress={() => setShowViewAll(true)}>
              <Text style={styles.inlineButtonText}>{t('view_all')}</Text>
            </Pressable>
          </View>
          {tickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketRow}>
              <View style={styles.ticketStatus}>
                <MaterialIcons
                  name={ticket.status === 'open' ? 'chat-bubble' : 'check-circle'}
                  size={18}
                  color={ticket.status === 'open' ? palette.warning : palette.primary}
                />
              </View>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <Text style={styles.ticketMeta}>{ticket.id}</Text>
                <Text style={styles.ticketMeta}>{ticket.updatedAt}</Text>
              </View>
              <Text style={styles.ticketState}>
                {ticket.status === 'open' ? 'Open' : 'Resolved'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('contact_us')}</Text>
          <Text style={styles.cardSubtitle}>
            We are available 24/7 to help with orders and account issues.
          </Text>
          <View style={styles.contactRow}>
            <Pressable
              style={styles.contactButtonPrimary}
              onPress={() => setShowChat(true)}>
              <MaterialIcons name="chat" size={16} color="#fff" />
              <Text style={styles.contactButtonPrimaryText}>{t('chat_now')}</Text>
            </Pressable>
            <Pressable
              style={styles.contactButtonSecondary}
              onPress={() => setShowCall(true)}>
              <MaterialIcons name="call" size={16} color={palette.primary} />
              <Text style={styles.contactButtonSecondaryText}>{t('call_support')}</Text>
            </Pressable>
          </View>
          <View style={styles.emailRow}>
            <MaterialIcons name="mail" size={16} color={palette.mutedAlt} />
            <Text style={styles.emailText}>support@grocerease.com</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!activeTopic} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeTopic}</Text>
              <Pressable onPress={() => setActiveTopic(null)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>Recommended actions</Text>
              <View style={styles.optionList}>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Track latest order</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
                <Pressable style={styles.optionRow} onPress={() => setShowChat(true)}>
                  <Text style={styles.optionText}>Start chat</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
                <Pressable style={styles.optionRow} onPress={() => setShowCall(true)}>
                  <Text style={styles.optionText}>Request callback</Text>
                  <MaterialIcons name="chevron-right" size={18} color={palette.mutedAlt} />
                </Pressable>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setActiveTopic(null)}>
                <Text style={styles.modalPrimaryText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showChat} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chat with support</Text>
              <Pressable onPress={() => setShowChat(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>
                  Hi! Tell us what you need help with and we will connect you to an agent.
                </Text>
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message..."
                placeholderTextColor={palette.mutedAlt}
                style={styles.chatInput}
                multiline
              />
            </View>
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.modalPrimary}
                onPress={() => {
                  setShowChat(false);
                  setMessage('');
                }}>
                <Text style={styles.modalPrimaryText}>Send message</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCall} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Call support</Text>
              <Pressable onPress={() => setShowCall(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>We can call you back in 2-5 minutes.</Text>
              <View style={styles.optionList}>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Request a callback</Text>
                  <MaterialIcons name="phone-forwarded" size={18} color={palette.primary} />
                </Pressable>
                <Pressable style={styles.optionRow}>
                  <Text style={styles.optionText}>Call now: +91 800 000 0000</Text>
                  <MaterialIcons name="call" size={18} color={palette.primary} />
                </Pressable>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowCall(false)}>
                <Text style={styles.modalPrimaryText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showViewAll} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All support tickets</Text>
              <Pressable onPress={() => setShowViewAll(false)}>
                <MaterialIcons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              {tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketRow}>
                  <View style={styles.ticketStatus}>
                    <MaterialIcons
                      name={ticket.status === 'open' ? 'chat-bubble' : 'check-circle'}
                      size={18}
                      color={ticket.status === 'open' ? palette.warning : palette.primary}
                    />
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
                    <Text style={styles.ticketMeta}>{ticket.id}</Text>
                    <Text style={styles.ticketMeta}>{ticket.updatedAt}</Text>
                  </View>
                  <Text style={styles.ticketState}>
                    {ticket.status === 'open' ? 'Open' : 'Resolved'}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <Pressable style={styles.modalPrimary} onPress={() => setShowViewAll(false)}>
                <Text style={styles.modalPrimaryText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.background,
    },
    page: {
      padding: 18,
      gap: 16,
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
    },
    subtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    searchCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 16,
      gap: 10,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: palette.cardAlt,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    searchInput: {
      flex: 1,
      color: palette.text,
      fontSize: 13,
    },
    searchHint: {
      fontSize: 11,
      color: palette.muted,
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: palette.border,
      gap: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: palette.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    topicGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    topicTile: {
      width: '47%',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      backgroundColor: palette.cardAlt,
      gap: 8,
    },
    topicIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topicLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    inlineButton: {
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    inlineButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.primary,
    },
    ticketRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    ticketStatus: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: palette.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ticketInfo: {
      flex: 1,
      gap: 2,
    },
    ticketTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    ticketMeta: {
      fontSize: 11,
      color: palette.muted,
    },
    ticketState: {
      fontSize: 11,
      fontWeight: '600',
      color: palette.text,
    },
    contactRow: {
      flexDirection: 'row',
      gap: 12,
    },
    contactButtonPrimary: {
      flex: 1,
      backgroundColor: palette.primary,
      borderRadius: 16,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    contactButtonPrimaryText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 12,
    },
    contactButtonSecondary: {
      flex: 1,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    contactButtonSecondaryText: {
      color: palette.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    emailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    emailText: {
      fontSize: 12,
      color: palette.muted,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 18, 16, 0.45)',
      justifyContent: 'center',
      padding: 16,
    },
    modalCard: {
      backgroundColor: palette.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
      maxHeight: '85%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: palette.cardAlt,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    modalContent: {
      padding: 16,
      gap: 12,
    },
    modalSubtitle: {
      fontSize: 12,
      color: palette.muted,
    },
    modalFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: palette.cardAlt,
    },
    modalPrimary: {
      backgroundColor: palette.primary,
      borderRadius: 18,
      paddingVertical: 12,
      alignItems: 'center',
    },
    modalPrimaryText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },
    optionList: {
      gap: 10,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: palette.card,
    },
    optionText: {
      fontSize: 12,
      fontWeight: '600',
      color: palette.text,
    },
    chatBubble: {
      backgroundColor: palette.cardAlt,
      borderRadius: 14,
      padding: 12,
    },
    chatText: {
      fontSize: 12,
      color: palette.text,
    },
    chatInput: {
      minHeight: 80,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      padding: 12,
      fontSize: 13,
      color: palette.text,
      backgroundColor: palette.card,
      textAlignVertical: 'top',
    },
  });
