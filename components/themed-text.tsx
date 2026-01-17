// ============================================================================
// SLIP - ThemedText COMPONENT
// ============================================================================
// Un componente de texto que automáticamente cambia de color según el tema
// (modo claro u oscuro del dispositivo).
//
// ¿POR QUÉ USARLO?
//   - No tienes que pensar en colores cada vez que escribes texto
//   - Automáticamente se ve bien en modo claro Y oscuro
//   - Consistencia en toda la app
//
// FILE LOCATION: components/themed-text.tsx
// ============================================================================

import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

// =============================================================================
// TIPOS - Define qué props acepta este componente
// =============================================================================

export type ThemedTextProps = TextProps & {
  // Color personalizado para modo claro (opcional)
  lightColor?: string;

  // Color personalizado para modo oscuro (opcional)
  darkColor?: string;

  // Tipo de texto - cambia el tamaño y peso
  // 'default' = texto normal
  // 'title' = títulos grandes
  // 'defaultSemiBold' = texto normal pero más grueso
  // 'subtitle' = subtítulos
  // 'link' = enlaces (color azul)
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

// =============================================================================
// EL COMPONENTE
// =============================================================================

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest // Todas las demás props (children, onPress, etc.)
}: ThemedTextProps) {
  // Obtener el color de texto correcto según el tema
  // Si pasaste lightColor/darkColor, usa esos
  // Si no, usa los colores por defecto del tema
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        // 1. Color base según el tema
        { color },

        // 2. Estilo según el tipo (solo aplica si type coincide)
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,

        // 3. Estilos personalizados que pases (sobrescriben los anteriores)
        style,
      ]}
      {...rest}
    />
  );
}

// =============================================================================
// ESTILOS - Los diferentes tipos de texto
// =============================================================================

const styles = StyleSheet.create({
  // Texto normal - para párrafos y contenido general
  default: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Texto semi-negrita - para énfasis
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },

  // Títulos grandes - para encabezados de pantalla
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },

  // Subtítulos - para secciones
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },

  // Enlaces - texto clickeable
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: "#0a7ea4", // Azul para links
  },
});

// =============================================================================
// EJEMPLOS DE USO
// =============================================================================
//
//   import { ThemedText } from '@/components/themed-text';
//
//   // Texto normal
//   <ThemedText>Hola mundo</ThemedText>
//
//   // Título
//   <ThemedText type="title">Mi App</ThemedText>
//
//   // Subtítulo
//   <ThemedText type="subtitle">Sección 1</ThemedText>
//
//   // Con estilo personalizado
//   <ThemedText style={{ fontSize: 20 }}>Texto grande</ThemedText>
//
//   // Con color personalizado
//   <ThemedText lightColor="red" darkColor="pink">Texto rojo</ThemedText>
//
// =============================================================================
