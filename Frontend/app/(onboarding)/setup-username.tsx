// app/(onboarding)/setup-username.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const MAX_USERNAME_LENGTH = 15;

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function SetupUsernameScreen() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<UsernameStatus>('idle');
  // FIX: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkUsername = useCallback((value: string) => {
    if (!value || value.length < 3) {
      setStatus('idle');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setStatus('invalid');
      return;
    }

    setStatus('checking');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const isAvailable = !value.toLowerCase().startsWith('taken');
        setStatus(isAvailable ? 'available' : 'taken');
      } catch (error) {
        setStatus('idle');
      }
    }, 300);
  }, []);

  useEffect(() => {
    checkUsername(username);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [username, checkUsername]);

  const handleContinue = () => {
    if (status !== 'available') return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(onboarding)/slides');
  };

  const handleClaimUsername = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(onboarding)/claim-username',
      params: { desiredUsername: username },
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <Ionicons name="checkmark-circle" size={24} color="#34C759" />;
      case 'taken':
      case 'invalid':
        return <Ionicons name="close-circle" size={24} color="#FF3B30" />;
      case 'checking':
        return <Ionicons name="ellipsis-horizontal" size={24} color="#86868b" />;
      default:
        return <Ionicons name="checkmark-circle" size={24} color="#ccc" />;
    }
  };

  const getHelperText = () => {
    switch (status) {
      case 'available':
        return { text: '*Username available', color: '#34C759' };
      case 'taken':
        return { text: '*Username not available', color: '#FF3B30' };
      case 'invalid':
        return { text: '*Only letters, numbers, and underscores', color: '#FF3B30' };
      default:
        return { text: '*Name should be 15 characters or less', color: '#86868b' };
    }
  };

  const helperInfo = getHelperText();
  const canContinue = status === 'available';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Account</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <View style={[styles.progressBar, styles.progressBarActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Your Username</Text>
        <Text style={styles.subtitle}>
          Create your username and you can change it later.
        </Text>

        {/* Input */}
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_USERNAME_LENGTH}
            />
            <View style={styles.inputIcon}>
              {getStatusIcon()}
            </View>
          </View>
          <View style={styles.helperRow}>
            <Text style={[styles.helperText, { color: helperInfo.color }]}>
              {helperInfo.text}
            </Text>
            <Text style={styles.charCount}>
              {username.length}/{MAX_USERNAME_LENGTH}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            canContinue ? styles.continueButtonActive : styles.continueButtonInactive,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text
            style={[
              styles.continueButtonText,
              canContinue ? styles.continueButtonTextActive : styles.continueButtonTextInactive,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        {/* Claim Username Link (show when taken) */}
        {status === 'taken' && (
          <View style={styles.claimContainer}>
            <Text style={styles.claimQuestion}>Are you a brand or influencer?</Text>
            <TouchableOpacity onPress={handleClaimUsername}>
              <Text style={styles.claimLink}>Claim Username</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: '#000',
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
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 18,
    paddingHorizontal: 16,
    paddingRight: 50,
    borderRadius: 12,
    fontSize: 17,
    color: '#000',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#86868b',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  continueButtonInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: '#000',
  },
  continueButtonTextInactive: {
    color: '#ccc',
  },
  claimContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  claimQuestion: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  claimLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});