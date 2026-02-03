// app/(onboarding)/claim-username.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const MAX_USERNAME_LENGTH = 15;

export default function ClaimUsernameScreen() {
  const { desiredUsername } = useLocalSearchParams<{ desiredUsername: string }>();
  
  const [formData, setFormData] = useState({
    username: desiredUsername || '',
    website: '',
    instagram: '',
    email: '',
    phone: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.username.length >= 3 &&
      formData.email.includes('@') &&
      formData.phone.length >= 10
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: '/(onboarding)/claim-submitted',
      params: { username: formData.username },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Claim Username</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>Claim Username</Text>
          <Text style={styles.subtitle}>
            If you are an existing brand or influencer, claim your username here.
          </Text>

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Desired Username"
              placeholderTextColor="#aaa"
              value={formData.username}
              onChangeText={(text) => updateField('username', text)}
              autoCapitalize="none"
              maxLength={MAX_USERNAME_LENGTH}
            />
            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                *Name should be 15 characters or less
              </Text>
              <Text style={styles.charCount}>
                {formData.username.length}/{MAX_USERNAME_LENGTH}
              </Text>
            </View>
          </View>

          {/* Contact Info Section */}
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <Text style={styles.sectionSubtitle}>
            Contact information in case we have any questions.{'\n'}
            Verification may take up to 48 hours.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Website"
            placeholderTextColor="#aaa"
            value={formData.website}
            onChangeText={(text) => updateField('website', text)}
            autoCapitalize="none"
            keyboardType="url"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Instagram URL"
            placeholderTextColor="#aaa"
            value={formData.instagram}
            onChangeText={(text) => updateField('instagram', text)}
            autoCapitalize="none"
            keyboardType="url"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            placeholderTextColor="#aaa"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            placeholderTextColor="#aaa"
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            keyboardType="phone-pad"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isFormValid() ? styles.submitButtonActive : styles.submitButtonInactive,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid()}
          >
            <Text
              style={[
                styles.submitButtonText,
                isFormValid() ? styles.submitButtonTextActive : styles.submitButtonTextInactive,
              ]}
            >
              Submit Request
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            Read our <Text style={styles.termsBold}>Privacy Policy</Text>. Tap "Agree and continue"{'\n'}
            to accept <Text style={styles.termsBold}>Terms of Service</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#86868b',
    lineHeight: 22,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 17,
    color: '#000',
    marginBottom: 10,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -2,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#86868b',
  },
  charCount: {
    fontSize: 12,
    color: '#86868b',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#86868b',
    lineHeight: 18,
    marginBottom: 15,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  submitButtonActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  submitButtonInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  submitButtonTextActive: {
    color: '#000',
  },
  submitButtonTextInactive: {
    color: '#ccc',
  },
  termsText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsBold: {
    fontWeight: '700',
    color: '#000',
  },
});