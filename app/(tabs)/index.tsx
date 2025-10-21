import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TopBar } from '@/components/ui/top-bar';

export default function HomeScreen() {
  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar title='FitGym' rightIconName='gearshape.fill' />
      <ThemedText style={{ marginTop: 12 }}>HomeScreen</ThemedText>
    </Screen>
  );
}
