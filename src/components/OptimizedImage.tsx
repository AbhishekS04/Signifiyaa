import React from 'react';
import { Image, ImageProps } from 'react-native';

/**
 * Optimized Image component that prevents re-renders during scroll
 * and uses progressive loading for better performance
 */
const OptimizedImage = React.memo((props: ImageProps) => {
    return (
        <Image
            {...props}
            // Progressive loading - show low quality first, then high quality
            progressiveRenderingEnabled={true}
            // Fade in smoothly when loaded
            fadeDuration={150}
        />
    );
}, (prevProps, nextProps) => {
    // Only re-render if source URI changes
    return prevProps.source === nextProps.source &&
        prevProps.style === nextProps.style;
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
