import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
};

const TermsModal = ({ visible, onClose }: TermsModalProps) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container} className="mt-9">
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Raet Terms of Service</Text>
          <Text style={styles.subheader}>Effective Date: 10/08/2024</Text>

          {/* Terms of Service Content */}
          <Text style={styles.section}>
            Welcome to Raet, a dating app designed to help you find meaningful
            connections. By using our app, you agree to these Terms of Service
            ("Terms"). If you do not agree to these Terms, you may not access or
            use the app. Please read them carefully.
          </Text>

          <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
          <Text style={styles.section}>
            By creating a Raet account or using the Raet app, you agree to be
            bound by these Terms of Service, our Privacy Policy, and any
            additional terms that may apply. You confirm that you are at least
            18 years old and legally able to enter into these terms.
          </Text>

          <Text style={styles.sectionHeader}>2. Eligibility</Text>
          <Text style={styles.section}>
            You must be at least 18 years old to use Raet. By using the app, you
            represent and warrant that you are at least 18 years old and that
            you have the right, authority, and capacity to enter into and abide
            by these Terms.
          </Text>

          <Text style={styles.sectionHeader}>3. User Responsibilities</Text>
          <Text style={styles.section}>
            When using Raet, you agree to provide accurate, truthful, and
            up-to-date information in your profile. Only create one account per
            user. Keep your login credentials secure and confidential. You must
            not use the app for unlawful purposes, including harassment, abuse,
            or fraud. You must not post offensive, harmful, or inappropriate
            content, and you must be respectful in all interactions with other
            users. You are solely responsible for the content and actions that
            occur under your account. Raet is not responsible for any user
            interactions or the content users post.
          </Text>

          <Text style={styles.sectionHeader}>4. Account Termination</Text>
          <Text style={styles.section}>
            Raet reserves the right to suspend or terminate your account if you
            violate these Terms of Service, engage in behavior that is harmful,
            offensive, or illegal, or if your account is reported for misuse by
            other users. Raet may also terminate or suspend your account at its
            discretion, without notice, if we deem it necessary for the safety
            and well-being of other users.
          </Text>

          <Text style={styles.sectionHeader}>5. User Data Collection</Text>
          <Text style={styles.section}>
            Raet collects, stores, and processes the following types of data:
            {"\n"}• Profile Information: Name, email, photos, bio, gender,
            sexual preferences, and age.{"\n"}• Location Data: We collect your
            geolocation to show nearby matches.{"\n"}• Usage Data: App
            interactions, messages, matches, and swipes are logged to improve
            user experience.{"\n"}• Device Information: Device identifiers, IP
            address, and operating system.{"\n"}• Photos and Media: Photos you
            upload and share through the app.{"\n"}• Communications: Messages
            and interactions with other users.
            {"\n\n"}For more details on how we collect and process your data,
            please refer to our Privacy Policy.
          </Text>

          <Text style={styles.sectionHeader}>6. Community Guidelines</Text>
          <Text style={styles.section}>
            To maintain a safe and respectful environment, users are expected to
            follow these guidelines:{"\n"}• No harassment, discrimination, or
            hate speech.{"\n"}• No spam, phishing, or attempts to solicit
            personal or financial information from other users.{"\n"}• No
            impersonation or misrepresentation of your identity or affiliation.
            {"\n"}• No sexually explicit content or illegal activities.{"\n"}
            Raet reserves the right to review and remove content that violates
            these guidelines, and may terminate your account in case of
            violations.
          </Text>

          <Text style={styles.sectionHeader}>7. In-App Purchases</Text>
          <Text style={styles.section}>
            Raet offers premium features through in-app purchases, which may
            include but are not limited to:{"\n"}• Boosting your profile
            visibility.{"\n"}• Seeing who liked your profile.{"\n"}• Sending
            super likes.{"\n"}All purchases are non-refundable, and any
            recurring subscriptions must be managed through your app store
            settings. By purchasing a subscription, you agree to the applicable
            pricing and payment terms.
          </Text>

          <Text style={styles.sectionHeader}>8. Licenses and Rights</Text>
          <Text style={styles.section}>
            By using Raet, you grant us a non-exclusive, royalty-free,
            perpetual, and worldwide license to use, modify, reproduce, and
            display your content (such as profile information, photos, and
            interactions) in connection with the services provided by Raet. We
            do not claim ownership of your content, but we may use it to promote
            the app or enhance the user experience.
          </Text>

          <Text style={styles.sectionHeader}>9. Limitation of Liability</Text>
          <Text style={styles.section}>
            Raet provides a platform for users to connect, but we cannot
            guarantee the behavior or actions of any user. You acknowledge that
            Raet is not liable for:{"\n"}• Any interactions, conversations, or
            outcomes that occur within or outside the app.{"\n"}• Any damages,
            losses, or injuries resulting from the use of the app.{"\n"}• The
            accuracy or reliability of user-generated content.{"\n"}You agree to
            use Raet at your own risk and understand that we are not responsible
            for any harmful interactions or events that may occur through the
            app.
          </Text>

          <Text style={styles.sectionHeader}>10. Dispute Resolution</Text>
          <Text style={styles.section}>
            In the event of a dispute arising from the use of Raet, both parties
            agree to resolve the issue through binding arbitration in [Insert
            your jurisdiction]. You agree to waive any rights to pursue claims
            in court or through a class action lawsuit.
          </Text>

          <Text style={styles.sectionHeader}>
            11. Changes to the Terms of Service
          </Text>
          <Text style={styles.section}>
            Raet reserves the right to modify or update these Terms of Service
            at any time. Any changes will be posted in the app, and your
            continued use of the app signifies your acceptance of the updated
            terms. It is your responsibility to review the Terms regularly.
          </Text>

          <Text style={styles.sectionHeader}>12. Contact Us</Text>
          <Text style={styles.section}>
            If you have any questions or concerns about these Terms of Service,
            you can contact us at:{"\n"}• Email: support@raet.io{"\n"}• Address:
            75 Raymond RD, 02360
          </Text>
        </ScrollView>

        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  section: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TermsModal;
