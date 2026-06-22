import { Image, View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZE } from '@/constants/theme';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<LogoSize, { img: number; text: number; gap: number }> = {
  sm: { img: 36,  text: FONT_SIZE.md,  gap: 6  },
  md: { img: 56,  text: FONT_SIZE.xl,  gap: 8  },
  lg: { img: 80,  text: FONT_SIZE.xxl, gap: 10 },
  xl: { img: 110, text: 36,            gap: 12 },
};

interface LogoProps {
  size?: LogoSize;
  dark?: boolean;
}

export function Logo({ size = 'md', dark = false }: LogoProps) {
  const s = SIZE_MAP[size];
  const textColor = dark ? COLORS.textPrimary : COLORS.textOnDark;

  return (
    <View style={[styles.container, { gap: s.gap }]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: s.img, height: s.img, borderRadius: s.img * 0.22 }}
        resizeMode="contain"
      />
      <Text style={[styles.name, { fontSize: s.text, color: textColor }]}>
        Bolão{'\n'}
        <Text style={[styles.highlight, { fontSize: s.text }]}>Copa 2026</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  name: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
    textAlign: 'center',
  },
  highlight: {
    fontFamily: FONTS.extraBold,
    color: COLORS.gold,
  },
});