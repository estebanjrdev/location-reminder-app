import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Alert, FlatList, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TASK_NAME = 'background-location-task';

interface Reminder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  activationDate?: Date; // Nuevo campo para la fecha y hora de activación
}

export default function App() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [reminderName, setReminderName] = useState('');
  const [region, setRegion] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState(100);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [history, setHistory] = useState<Reminder[]>([]);

  useEffect(() => {
    const loadRemindersAndHistory = async () => {
      try {
        const storedReminders = await AsyncStorage.getItem('reminders');
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders));
        }
        const storedHistory = await AsyncStorage.getItem('history');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error('Failed to load reminders or history', e);
      }
    };

    const startLocationUpdates = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        Alert.alert('Permission to access background location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    };

    loadRemindersAndHistory();
    startLocationUpdates();
  }, []);

  useEffect(() => {
    const saveReminders = async () => {
      try {
        await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      } catch (e) {
        console.error('Failed to save reminders', e);
      }
    };
    saveReminders();
  }, [reminders]);

  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem('history', JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save history', e);
      }
    };
    saveHistory();
  }, [history]);

  const addReminder = async () => {
    if (reminderName && region) {
      const newReminder: Reminder = {
        id: `${reminderName}-${region.latitude}-${region.longitude}`,
        name: reminderName,
        latitude: region.latitude,
        longitude: region.longitude,
        radius: radius,
      };

      try {
        await Location.startGeofencingAsync(LOCATION_TASK_NAME, [
          {
            identifier: newReminder.id,
            radius: newReminder.radius,
            latitude: newReminder.latitude,
            longitude: newReminder.longitude,
            notifyOnEnter: true,
            notifyOnExit: false,
          },
        ]);

        setReminders([...reminders, newReminder]);
        setReminderName('');
        setRegion(null);
        setRadius(100);
        Alert.alert('Reminder added!');
      } catch (error) {
        console.error('Failed to add reminder:', error);
        Alert.alert('Failed to add reminder. Please try again.');
      }
    } else {
      Alert.alert('Please provide a task name and select a location.');
    }
  };

  const renderHistoryItem = ({ item }: { item: Reminder }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>{item.name}</Text>
      {item.activationDate && (
        <Text style={styles.historyText}>
          Activated at: {item.activationDate.toLocaleString()}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => setRegion(e.nativeEvent.coordinate)}
        >
          {region && <Marker coordinate={region} />}
          {location && (
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="Your Location"
              pinColor="blue"
            />
          )}
          {reminders.map((reminder) => (
            <Marker
              key={reminder.id}
              coordinate={{ latitude: reminder.latitude, longitude: reminder.longitude }}
              title={reminder.name}
              description={`Radius: ${reminder.radius} meters`}
            />
          ))}
          {reminders.map((reminder) => (
            <Circle
              key={reminder.id}
              center={{ latitude: reminder.latitude, longitude: reminder.longitude }}
              radius={reminder.radius}
              strokeColor="rgba(255,0,0,0.5)"
              fillColor="rgba(255,0,0,0.2)"
            />
          ))}
        </MapView>
      )}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Task Name"
          value={reminderName}
          onChangeText={setReminderName}
        />
        <TextInput
          style={styles.input}
          placeholder="Radius (meters)"
          keyboardType="numeric"
          value={radius.toString()}
          onChangeText={(text) => setRadius(parseInt(text))}
        />
        <Button title="Add Reminder" onPress={addReminder} />
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.history}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  form: {
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  history: {
    marginTop: 20,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

// Define la tarea de ubicación en segundo plano
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error en la tarea de ubicación:', error);
    return;
  }

  const { eventType, region } = data as { eventType: Location.GeofencingEventType; region: Location.LocationRegion };

  if (eventType === Location.GeofencingEventType.Enter) {
    const reminder = {
      id: region.identifier,
      name: region.identifier,
      latitude: region.latitude,
      longitude: region.longitude,
      radius: region.radius,
      activationDate: new Date(), // Fecha y hora de activación
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: `You have entered the region for your task: ${region.identifier}`,
      },
      trigger: null,
    });

    try {
      const storedHistory = await AsyncStorage.getItem('history');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      history.push(reminder);
      await AsyncStorage.setItem('history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to update history', e);
    }
  }
});
