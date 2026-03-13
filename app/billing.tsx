// // app/billing.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Colors,
    FontFamily,
    FontSize,
    Layout,
    Radii,
    Shadows,
    Spacing,
} from "../constants/theme";

const PAYMENT_METHODS = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Wallets",
];

const BENEFITS = [
  "120+ HD video lessons",
  "Downloadable PDF notes",
  "5 full-length mock tests",
  "Lifetime access — no expiry",
  "All exam syllabus mapped",
  "Offline download support",
];

export default function BillingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("UPI");

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>
              History Mastery — Complete Course
            </Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderDetail}>Original price</Text>
            <Text style={styles.orderStrike}>₹2,999</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.orderDetail, { color: Colors.success }]}>
              🎉 Limited Discount (67%)
            </Text>
            <Text
              style={[
                styles.orderStrike,
                { color: Colors.success, textDecorationLine: "none" },
              ]}
            >
              - ₹2,000
            </Text>
          </View>
          <View style={[styles.orderRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>₹999</Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>You're getting</Text>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Text style={styles.benefitCheck}>✅</Text>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Payment methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <View style={styles.methodsGrid}>
            {PAYMENT_METHODS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.methodChip,
                  selectedMethod === m && styles.methodChipActive,
                ]}
                onPress={() => setSelectedMethod(m)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.methodText,
                    selectedMethod === m && styles.methodTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Guarantee */}
        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeEmoji}>🛡️</Text>
          <View style={styles.guaranteeInfo}>
            <Text style={styles.guaranteeTitle}>
              7-Day Money-Back Guarantee
            </Text>
            <Text style={styles.guaranteeSub}>
              Not satisfied? Get a full refund within 7 days — no questions
              asked.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Pay button */}
      <View
        style={[
          styles.stickyBottom,
          { paddingBottom: insets.bottom || Spacing[4] },
        ]}
      >
        <View style={styles.stickyMeta}>
          <Text style={styles.stickyMethod}>{selectedMethod}</Text>
          <Text style={styles.stickySecure}>🔒 Secured by Razorpay</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => console.log("Payment initiated")}
          style={styles.payBtnWrap}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payBtn}
          >
            <Text style={styles.payBtnText}>Pay ₹999</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { width: 60 },
  backText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  scrollContent: { padding: Layout.screenPaddingH, gap: Spacing[4] },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    ...Shadows.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing[4],
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[2],
  },
  orderLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
    flex: 1,
  },
  orderDetail: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  orderStrike: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    textDecorationLine: "line-through",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing[2],
    paddingTop: Spacing[3],
  },
  totalLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  totalPrice: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[2],
  },
  benefitCheck: { fontSize: 16 },
  benefitText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.text,
    flex: 1,
  },
  methodsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[2] },
  methodChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2] + 2,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  methodChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  methodText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  methodTextActive: { color: Colors.primary },
  guaranteeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    backgroundColor: Colors.success + "12",
    borderWidth: 1,
    borderColor: Colors.success + "30",
    borderRadius: Radii.xl,
    padding: Spacing[4],
  },
  guaranteeEmoji: { fontSize: 32 },
  guaranteeInfo: { flex: 1 },
  guaranteeTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
    marginBottom: Spacing[1],
  },
  guaranteeSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
    lineHeight: FontSize.sm * 1.6,
  },
  stickyBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  stickyMeta: { gap: 2 },
  stickyMethod: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  stickySecure: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  payBtnWrap: { flex: 1 },
  payBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Alert, ActivityIndicator,
// } from 'react-native';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import RazorpayCheckout from 'react-native-razorpay';
// import { useAuthStore } from '../lib/store';
// import { supabase } from '../lib/supabase';
// import { Colors, Typography, Radii, Shadows, Layout } from '../constants/theme';

// const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY!;

// // Price in paise (₹999 = 99900 paise)
// const COURSE_PRICE_PAISE = 99900;
// const COURSE_PRICE_DISPLAY = '₹999';

// export default function BillingScreen() {
//   const insets = useSafeAreaInsets();
//   const { profile, user } = useAuthStore();
//   const [loading, setLoading] = useState(false);

//   const createRazorpayOrder = async (): Promise<string> => {
//     // In production: call your backend API to create a Razorpay order
//     // Backend returns order_id, which you pass to Razorpay checkout
//     // For now, we simulate with a placeholder
//     // Example backend endpoint: POST /api/create-order
//     const response = await fetch('YOUR_BACKEND_URL/api/create-order', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         amount: COURSE_PRICE_PAISE,
//         currency: 'INR',
//         receipt: `receipt_${user?.id}_${Date.now()}`,
//       }),
//     });
//     const data = await response.json();
//     return data.order_id;
//   };

//   const handlePayment = async () => {
//     if (!profile || !user) {
//       Alert.alert('Please log in first');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Step 1: Create Razorpay order from your backend
//       // const orderId = await createRazorpayOrder();

//       // ── Razorpay Checkout Options ────────────────────────────────────────
//       const options = {
//         description: 'History Mastery Course — Lifetime Access',
//         image: 'https://your-app-logo-url.com/logo.png',
//         currency: 'INR',
//         key: RAZORPAY_KEY,
//         amount: COURSE_PRICE_PAISE,
//         // order_id: orderId,     // ← uncomment when backend is ready
//         name: 'History Mastery',
//         prefill: {
//           email: profile.email,
//           contact: '',           // Add phone if you collect it
//           name: profile.full_name,
//         },
//         theme: { color: '#C4622D' },
//         // UPI, cards, netbanking, wallets are all automatically available
//       };

//       // Step 2: Open Razorpay checkout
//       const paymentData = await RazorpayCheckout.open(options);

//       // Step 3: Verify payment on your backend (critical for security!)
//       // In production: send paymentData to backend for signature verification
//       // await verifyPaymentOnBackend(paymentData);

//       // Step 4: Mark user as paid in Supabase
//       await supabase
//         .from('profiles')
//         .update({ is_paid: true })
//         .eq('id', user.id);

//       // Step 5: Record purchase
//       await supabase.from('purchases').insert({
//         user_id: user.id,
//         razorpay_payment_id: paymentData.razorpay_payment_id,
//         razorpay_order_id: paymentData.razorpay_order_id ?? '',
//         amount: COURSE_PRICE_PAISE,
//         status: 'completed',
//       });

//       // Step 6: Update local state
//       useAuthStore.getState().setProfile({
//         ...profile,
//         is_paid: true,
//       });

//       setLoading(false);

//       Alert.alert(
//         '🎉 Payment Successful!',
//         'Welcome to History Mastery! You now have full access to all lessons.',
//         [{ text: 'Start Learning', onPress: () => router.replace('/(tabs)') }]
//       );
//     } catch (error: any) {
//       setLoading(false);
//       // Razorpay returns { code, description } on failure/cancellation
//       if (error?.code === 'PAYMENT_CANCELLED') {
//         // User cancelled — don't show error
//         return;
//       }
//       Alert.alert('Payment Failed', error?.description ?? 'Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.content,
//           { paddingTop: insets.top + 16, paddingBottom: 40 },
//         ]}
//       >
//         {/* Header */}
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.pageTitle}>Complete Your Enrollment</Text>
//         <Text style={styles.pageSubtitle}>
//           One-time payment · Lifetime access · All future updates included
//         </Text>

//         {/* Order summary */}
//         <View style={styles.orderCard}>
//           <Text style={styles.orderCardTitle}>Order Summary</Text>

//           <View style={styles.orderRow}>
//             <View style={styles.orderItemLeft}>
//               <Text style={styles.orderItemIcon}>📚</Text>
//               <View>
//                 <Text style={styles.orderItemName}>History Mastery Course</Text>
//                 <Text style={styles.orderItemDesc}>Lifetime Access · All Exams</Text>
//               </View>
//             </View>
//             <Text style={styles.orderItemPrice}>₹2,499</Text>
//           </View>

//           <View style={[styles.orderRow, styles.discountRow]}>
//             <Text style={styles.discountLabel}>🎁 Launch discount (60% off)</Text>
//             <Text style={styles.discountAmount}>−₹1,500</Text>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.orderRow}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalAmount}>₹999</Text>
//           </View>

//           <View style={styles.orderRow}>
//             <Text style={styles.gstLabel}>Incl. 18% GST</Text>
//             <Text style={styles.gstAmount}>₹152.54</Text>
//           </View>
//         </View>

//         {/* What you get */}
//         <View style={styles.benefitsCard}>
//           <Text style={styles.benefitsTitle}>You're getting</Text>
//           {[
//             '✅ Full access to 200+ video lessons',
//             '✅ All chapters: Ancient, Medieval & Modern India',
//             '✅ APTET, DSC, UPSC & TSPSC coverage',
//             '✅ Progress tracking & daily streaks',
//             '✅ New lessons added regularly',
//             '✅ Watch on iOS & Android',
//           ].map((b) => (
//             <Text key={b} style={styles.benefitItem}>{b}</Text>
//           ))}
//         </View>

//         {/* Payment methods info */}
//         <View style={styles.paymentMethodsCard}>
//           <Text style={styles.paymentMethodsTitle}>Accepted payment methods</Text>
//           <View style={styles.methodsRow}>
//             {['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Wallets'].map((m) => (
//               <View key={m} style={styles.methodChip}>
//                 <Text style={styles.methodChipText}>{m}</Text>
//               </View>
//             ))}
//           </View>
//           <Text style={styles.paymentNote}>
//             Powered by Razorpay · 256-bit SSL encryption
//           </Text>
//         </View>

//         {/* Guarantee */}
//         <View style={styles.guaranteeCard}>
//           <Text style={styles.guaranteeEmoji}>🔒</Text>
//           <Text style={styles.guaranteeText}>
//             <Text style={styles.guaranteeBold}>7-day money-back guarantee.</Text>
//             {' '}If you're not satisfied, write to us and we'll refund you — no questions asked.
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Sticky Pay Button */}
//       <View style={[styles.stickyPay, { paddingBottom: insets.bottom + 16 }]}>
//         <TouchableOpacity
//           style={[styles.payBtn, loading && styles.payBtnDisabled]}
//           onPress={handlePayment}
//           disabled={loading}
//           activeOpacity={0.88}
//         >
//           <LinearGradient
//             colors={['#C4622D', '#E8845A']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.payBtnGradient}
//           >
//             {loading ? (
//               <ActivityIndicator color="#FFFFFF" />
//             ) : (
//               <Text style={styles.payBtnText}>
//                 Pay {COURSE_PRICE_DISPLAY} Securely →
//               </Text>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPadding, gap: 20 },

//   backBtn: { marginBottom: 8 },
//   backText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.primary,
//   },
//   pageTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//   },
//   pageSubtitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     lineHeight: 20,
//   },

//   // Order card
//   orderCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 20,
//     gap: 14,
//     ...Shadows.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   orderCardTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   orderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   orderItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   orderItemIcon: { fontSize: 28 },
//   orderItemName: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   orderItemDesc: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   orderItemPrice: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textMuted,
//     textDecorationLine: 'line-through',
//   },
//   discountRow: { backgroundColor: Colors.successLight, borderRadius: Radii.sm, padding: 10 },
//   discountLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.success,
//   },
//   discountAmount: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.success,
//   },
//   divider: { height: 1, backgroundColor: Colors.border },
//   totalLabel: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.lg,
//     color: Colors.textPrimary,
//   },
//   totalAmount: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.primary,
//   },
//   gstLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },
//   gstAmount: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },

//   // Benefits
//   benefitsCard: {
//     backgroundColor: Colors.surfaceWarm,
//     borderRadius: Radii.lg,
//     padding: 20,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   benefitsTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     marginBottom: 4,
//   },
//   benefitItem: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//   },

//   // Payment methods
//   paymentMethodsCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 16,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     ...Shadows.sm,
//   },
//   paymentMethodsTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//   },
//   methodsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   methodChip: {
//     backgroundColor: Colors.surfaceMuted,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: Radii.full,
//   },
//   methodChipText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textSecondary,
//   },
//   paymentNote: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },

//   // Guarantee
//   guaranteeCard: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 10,
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: Colors.success + '40',
//   },
//   guaranteeEmoji: { fontSize: 20, marginTop: 2 },
//   guaranteeText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//     flex: 1,
//   },
//   guaranteeBold: { fontFamily: Typography.bodyMedium, color: Colors.textPrimary },

//   // Sticky pay button
//   stickyPay: {
//     backgroundColor: Colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingHorizontal: Layout.screenPadding,
//     paddingTop: 16,
//     ...Shadows.lg,
//   },
//   payBtn: { borderRadius: Radii.full, overflow: 'hidden' },
//   payBtnDisabled: { opacity: 0.6 },
//   payBtnGradient: { paddingVertical: 18, alignItems: 'center' },
//   payBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: '#FFFFFF',
//     letterSpacing: 0.3,
//   },
// });
