package com.payease.app.helper;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class ContactDetails {

	@Field("UC1")
	private String phoneNumber;
	
	@Field("UC2")
	private String emailId;
	
	
//	public static void main(String[] args) {
		
//		for (int i = 2; i <= 100; i++) {
//			boolean a = false;
//			for (int j = 2; j <= Math.sqrt(i); j++) {
//				if (i % j == 0) {
//					a = true;
//					break;
//				}
//			}
//			if (!a) {
//				System.out.print(i + " ");
//			}
//		}

//		int a = 0;
//		int b = 1;
//		for (int i = 1; i <= 10; i++) {
//			int c = a + b;
//			System.out.println(" " + c);
//			a = b;
//			b = c;
//		}
//	}
//		int num = 12221;
//		int original = num, reversed = 0;
//		while (num != 0) {
//			reversed = reversed * 10 + num % 10;
//			num /= 10;
//		}
//		if (original == reversed) {
//			System.out.println("-----");
//		}
//	}
//		int num = 1222;
//		String str = String.valueOf(num);
//		String res = new StringBuilder(str).reverse().toString();
//		if(str.equals(res)) {
//			System.out.println("-----");	
//		}
//	}
}
