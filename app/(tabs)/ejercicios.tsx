import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { TopBar } from '@/components/ui/top-bar';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  completed: boolean;
  muscle: string;
}

export default function EjerciciosScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Press de banca',
      sets: 4,
      reps: '8-10',
      weight: '80kg',
      completed: false,
      muscle: 'Pecho'
    },
    {
      id: '2',
      name: 'Sentadillas',
      sets: 4,
      reps: '12-15',
      weight: '100kg',
      completed: true,
      muscle: 'Piernas'
    },
    {
      id: '3',
      name: 'Peso muerto',
      sets: 3,
      reps: '6-8',
      weight: '120kg',
      completed: false,
      muscle: 'Espalda'
    },
    {
      id: '4',
      name: 'Press militar',
      sets: 3,
      reps: '8-10',
      weight: '50kg',
      completed: false,
      muscle: 'Hombros'
    },
    {
      id: '5',
      name: 'Dominadas',
      sets: 3,
      reps: '6-8',
      weight: 'Peso corporal',
      completed: true,
      muscle: 'Espalda'
    },
    {
      id: '6',
      name: 'Curl de bíceps',
      sets: 3,
      reps: '10-12',
      weight: '20kg',
      completed: false,
      muscle: 'Brazos'
    }
  ]);

  const toggleExercise = (id: string) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const totalCount = exercises.length;

  return (
    <Screen contentPadding={20} style={{ flex: 1 }}>
      <TopBar title="Mi rutina" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.section}>
          <ThemedText type="subtitle">Rutina de hoy</ThemedText>
          <ThemedText style={{ opacity: 0.7, marginBottom: 16 }}>
            Lunes - Tren superior
          </ThemedText>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <ThemedText type="defaultSemiBold" darkColor="#111">
                Progreso del entrenamiento
              </ThemedText>
              <Badge 
                label={`${completedCount}/${totalCount}`} 
                variant={completedCount === totalCount ? 'success' : 'secondary'} 
              />
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedCount / totalCount) * 100}%` }
                ]} 
              />
            </View>
            <ThemedText darkColor="#666" style={{ fontSize: 12 }}>
              {completedCount === totalCount ? '¡Rutina completada!' : `${totalCount - completedCount} ejercicios restantes`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Ejercicios</ThemedText>
          {exercises.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={[
                styles.exerciseCard,
                exercise.completed && styles.exerciseCardCompleted
              ]}
              onPress={() => toggleExercise(exercise.id)}
            >
              <View style={styles.exerciseHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText 
                    type="defaultSemiBold" 
                    darkColor={exercise.completed ? "#666" : "#111"}
                    style={exercise.completed && styles.completedText}
                  >
                    {exercise.name}
                  </ThemedText>
                  <ThemedText 
                    darkColor={exercise.completed ? "#888" : "#666"}
                    style={{ fontSize: 12 }}
                  >
                    {exercise.muscle}
                  </ThemedText>
                </View>
                <View style={styles.exerciseStats}>
                  <ThemedText 
                    darkColor={exercise.completed ? "#666" : "#111"}
                    style={[styles.statText, exercise.completed && styles.completedText]}
                  >
                    {exercise.sets} series
                  </ThemedText>
                  <ThemedText 
                    darkColor={exercise.completed ? "#666" : "#111"}
                    style={[styles.statText, exercise.completed && styles.completedText]}
                  >
                    {exercise.reps} reps
                  </ThemedText>
                  <ThemedText 
                    darkColor={exercise.completed ? "#666" : "#111"}
                    style={[styles.statText, exercise.completed && styles.completedText]}
                  >
                    {exercise.weight}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.checkContainer}>
                <View style={[
                  styles.checkbox,
                  exercise.completed && styles.checkboxCompleted
                ]}>
                  {exercise.completed && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Button 
            title={completedCount === totalCount ? "Finalizar entrenamiento" : "Pausar entrenamiento"}
            variant={completedCount === totalCount ? "default" : "secondary"}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    gap: 8,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseCardCompleted: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ddd',
  },
  exerciseHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});