// ============================================================================
// SLIP - useThemeColor HOOK
// ============================================================================
// Este hook te da el color correcto según el tema actual del dispositivo.
//
// ¿CÓMO FUNCIONA?
//   1. Detecta si el dispositivo está en modo claro u oscuro
//   2. Busca el color en tu archivo Colors (constants/theme.ts)
//   3. Te devuelve el color correcto
//
// FILE LOCATION: hooks/useThemeColor.ts
// ============================================================================

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * useThemeColor - Obtiene un color según el tema actual
 *
 * @param props - Colores personalizados opcionales { light?: string, dark?: string }
 * @param colorName - Nombre del color en el objeto Colors ('text', 'background', etc.)
 * @returns El color correcto para el tema actual
 *
 * EJEMPLO:
 *   const textColor = useThemeColor({}, 'text');
 *   // En modo claro: '#11181C'
 *   // En modo oscuro: '#ECEDEE'
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // 1. Detectar el tema actual (light, dark, o null)
  //    Si es null, usamos 'light' como valor por defecto
  const theme = useColorScheme() ?? "light";

  // 2. Verificar si el usuario pasó un color personalizado para este tema
  //    props.light o props.dark
  const colorFromProps = props[theme];

  // 3. Si hay un color personalizado, usarlo
  //    Si no, buscar en el objeto Colors
  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Colors[theme] = Colors.light o Colors.dark
    // Colors[theme][colorName] = por ejemplo Colors.light.text
    return Colors[theme][colorName];
  }
}

// =============================================================================
// EJEMPLOS DE USO
// =============================================================================
//
//   import { useThemeColor } from '@/hooks/useThemeColor';
//
//   function MyComponent() {
//     // Obtener color de texto del tema
//     const textColor = useThemeColor({}, 'text');
//
//     // Obtener color de fondo del tema
//     const bgColor = useThemeColor({}, 'background');
//
//     // Obtener color con override personalizado
//     const customColor = useThemeColor(
//       { light: 'red', dark: 'pink' },
//       'text' // fallback si no hay override
//     );
//
//     return (
//       <View style={{ backgroundColor: bgColor }}>
//         <Text style={{ color: textColor }}>Hola</Text>
//       </View>
//     );
//   }
//
// =============================================================================
