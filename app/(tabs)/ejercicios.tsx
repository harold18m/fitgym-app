import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TopBar } from '@/components/ui/top-bar';

export default function EjerciciosScreen() {
  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar />
      <ThemedText>
        Explora rutinas, planes y recomendaciones para tu entrenamiento.
      </ThemedText>
    </Screen>
  );
}