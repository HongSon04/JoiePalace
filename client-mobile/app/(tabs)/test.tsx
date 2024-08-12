import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const test = () => {
    return (
        <ThemedView>
            <ThemedText>
                This is a test tabs
            </ThemedText>
        </ThemedView>
    );
};

export default test;