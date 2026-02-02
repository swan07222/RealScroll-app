// app/(screens)/edit-profile.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/use-auth';
import { usersApi } from '@/api';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please grant access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.bio.length > 150) {
      newErrors.bio = 'Bio must be less than 150 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await usersApi.updateProfile({
        displayName: formData.displayName.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
        // In real app, upload avatar and get URL
        avatar: newAvatarUri || formData.avatar,
      });

      if (response.success) {
        updateUser(response.data);
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LoadingOverlay visible={isLoading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={newAvatarUri || formData.avatar}
            size={100}
            showVerified={user?.isVerified}
          />
          <TouchableOpacity style={styles.changePhotoButton} onPress={pickAvatar}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Name"
            placeholder="Your display name"
            value={formData.displayName}
            onChangeText={(text) => updateField('displayName', text)}
            error={errors.displayName}
            autoCapitalize="words"
          />

          <Input
            label="Username"
            placeholder="Your username"
            value={formData.username}
            onChangeText={(text) => updateField('username', text.toLowerCase())}
            error={errors.username}
            autoCapitalize="none"
            leftIcon="at"
          />

          <View style={styles.bioContainer}>
            <View style={styles.bioHeader}>
              <Text style={styles.bioLabel}>Bio</Text>
              <Text style={styles.bioCount}>{formData.bio.length}/150</Text>
            </View>
            <Input
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChangeText={(text) => updateField('bio', text)}
              error={errors.bio}
              multiline
              numberOfLines={4}
              containerStyle={styles.bioInput}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  scrollContent: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  form: {
    gap: 8,
  },
  bioContainer: {
    marginTop: 8,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  bioCount: {
    fontSize: 12,
    color: '#666',
  },
  bioInput: {
    marginBottom: 0,
  },
});