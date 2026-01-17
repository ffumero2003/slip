// ============================================================================
// SLIP - ThemedView COMPONENT
// ============================================================================
// Un contenedor (View) que automáticamente tiene el color de fondo correcto
// según el tema (modo claro u oscuro).
//
// ¿POR QUÉ USARLO?
//   - El fondo cambia automáticamente con el tema del dispositivo
//   - Modo claro = fondo blanco
//   - Modo oscuro = fondo oscuro
//   - No tienes que pensar en colores de fondo
//
// FILE LOCATION: components/themed-view.tsx
// ============================================================================

import { useThemeColor } from "@/hooks/useThemeColor";
import { View, type ViewProps } from "react-native";

// =============================================================================
// TIPOS
// =============================================================================

export type ThemedViewProps = ViewProps & {
  // Color de fondo personalizado para modo claro (opcional)
  lightColor?: string;

  // Color de fondo personalizado para modo oscuro (opcional)
  darkColor?: string;
};

// =============================================================================
// EL COMPONENTE
// =============================================================================

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps // children, onPress, etc.
}: ThemedViewProps) {
  // Obtener el color de fondo correcto según el tema
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  // Renderizar un View normal pero con el backgroundColor del tema
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

// =============================================================================
// EJEMPLOS DE USO
// =============================================================================
//
//   import { ThemedView } from '@/components/themed-view';
//
//   // Contenedor básico (fondo según tema)
//   <ThemedView style={{ flex: 1 }}>
//     <Text>Contenido aquí</Text>
//   </ThemedView>
//
//   // Con color de fondo personalizado
//   <ThemedView lightColor="#f0f0f0" darkColor="#222">
//     <Text>Fondo gris claro / oscuro</Text>
//   </ThemedView>
//
//   // Como pantalla completa
//   <ThemedView style={{ flex: 1, padding: 20 }}>
//     {/* Tu contenido */}
//   </ThemedView>
//
// =============================================================================
