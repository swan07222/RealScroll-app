// app/(tabs)/create.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading';

export default function CreateScreen() {
  const [content, setContent] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = usePosts();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please grant access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please grant access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaUri) {
      Alert.alert('Empty post', 'Please add some content or an image');
      return;
    }

    setIsLoading(true);
    try {
      await createPost({
        content: content.trim(),
        mediaType: mediaUri ? 'image' : 'text',
        mediaUri: mediaUri || undefined,
        location: location || undefined,
      });
      
      // Reset form
      setContent('');
      setMediaUri(null);
      setLocation('');
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = () => {
    setMediaUri(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LoadingOverlay visible={isLoading} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <Button
          title="Post"
          size="small"
          onPress={handlePost}
          disabled={(!content.trim() && !mediaUri) || isLoading}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content Input */}
        <TextInput
          style={styles.contentInput}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Media Preview */}
        {mediaUri && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: mediaUri }} style={styles.mediaPreview} contentFit="cover" />
            <TouchableOpacity style={styles.removeMediaButton} onPress={removeMedia}>
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Location Input */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <TextInput
            style={styles.locationInput}
            placeholder="Add location"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Verification Notice */}
        <View style={styles.verificationNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
          <Text style={styles.verificationText}>
            Your content will be verified as authentic before publishing
          </Text>
        </View>
      </ScrollView>

      {/* Media Actions */}
      <View style={styles.mediaActions}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#000" />
          <Text style={styles.mediaButtonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color="#000" />
          <Text style={styles.mediaButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentInput: {
    fontSize: 18,
    lineHeight: 26,
    color: '#000',
    minHeight: 120,
  },
  mediaContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaPreview: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#000',
  },
  verificationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  verificationText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
  },
  mediaActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    gap: 16,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});