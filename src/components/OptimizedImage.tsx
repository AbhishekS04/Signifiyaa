import React from 'react';
import { Image, ImageProps } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';

interface OptimizedImageProps {
    source: any;
    style?: StyleProp<ImageStyle>;
    className?: string;
    contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    [key: string]: any;
}

/**
 * Optimized Image component using expo-image for:
 * - Memory + disk caching
 * - Smooth crossfade transitions
 * - BlurHash placeholders
 * - Hardware-accelerated rendering
 */
const OptimizedImage = React.memo(({ source, style, contentFit = 'cover', ...rest }: OptimizedImageProps) => {
    return (
        <Image
            source={source}
            style={style}
            contentFit={contentFit}
            cachePolicy="memory-disk"
            transition={200}
            recyclingKey={typeof source === 'object' && source?.uri ? source.uri : undefined}
            {...rest}
        />
    );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
