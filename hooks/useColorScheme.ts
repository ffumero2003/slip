// ============================================================================
// SLIP - useColorScheme HOOK
// ============================================================================
// Este hook detecta si el dispositivo está en modo claro u oscuro.
//
// ¿QUÉ DEVUELVE?
//   - 'light' = modo claro
//   - 'dark' = modo oscuro
//   - null = no se pudo detectar (raro)
//
// Es básicamente un re-export del hook de React Native, pero lo tenemos
// en un archivo separado por si queremos agregar lógica extra después
// (por ejemplo, guardar la preferencia del usuario).
//
// FILE LOCATION: hooks/useColorScheme.ts
// ============================================================================

// Importamos y re-exportamos el hook de React Native
// Esto detecta automáticamente la configuración del sistema operativo
export { useColorScheme } from "react-native";

// =============================================================================
// CÓMO FUNCIONA
// =============================================================================
//
// React Native detecta la preferencia del sistema:
//   - iOS: Settings > Display & Brightness > Light/Dark
//   - Android: Settings > Display > Dark theme
//
// Cuando el usuario cambia el tema, el hook se actualiza automáticamente
// y todos los componentes que lo usan se re-renderizan con los nuevos colores.
//
// =============================================================================
// EJEMPLOS DE USO
// =============================================================================
//
//   import { useColorScheme } from '@/hooks/useColorScheme';
//
//   function MyComponent() {
//     const colorScheme = useColorScheme();
//
//     // colorScheme = 'light' o 'dark'
//
//     return (
//       <View style={{
//         backgroundColor: colorScheme === 'dark' ? '#000' : '#fff'
//       }}>
//         <Text style={{
//           color: colorScheme === 'dark' ? '#fff' : '#000'
//         }}>
//           Estoy en modo {colorScheme}
//         </Text>
//       </View>
//     );
//   }
//
// =============================================================================
// NOTA
// =============================================================================
//
// En la mayoría de casos, NO usarás este hook directamente.
// En su lugar, usa:
//   - <ThemedView> - para contenedores con fondo correcto
//   - <ThemedText> - para texto con color correcto
//   - useThemeColor() - para obtener cualquier color del tema
//
// Estos componentes ya usan useColorScheme internamente.
//
// =============================================================================
