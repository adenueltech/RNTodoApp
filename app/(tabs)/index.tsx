import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from 'react-native-elements'; 
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const [task, setTask] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks).map(task => ({
          ...task,
          time: new Date(task.time),
        }));
        setTodoList(tasks);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (tasks) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const addTask = () => {
    if (task) {
      const newTask = { id: Math.random().toString(), value: task, time: reminderTime.toISOString(), completed: false };
      const updatedTasks = [...todoList, newTask];
      setTodoList(updatedTasks);
      saveTasks(updatedTasks);
      setTask('');
      setShowPicker(false);
    }
  };

  const removeTask = (taskId) => {
    const updatedTasks = todoList.filter((task) => task.id !== taskId);
    setTodoList(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleSwitch = () => setIsDarkMode((prev) => !prev);

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowPicker(false);
    setReminderTime(currentDate);
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = todoList.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTodoList(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleDeleteCompletedTasks = () => {
    Alert.alert(
      'Delete Completed Tasks',
      'Have you completed all your selected tasks for the day?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => {
          const updatedTasks = todoList.filter((task) => !task.completed);
          setTodoList(updatedTasks);
          saveTasks(updatedTasks);
        }},
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <LinearGradient colors={['orange', 'purple', 'red']} style={styles.titleGradient}>
        <Text style={[styles.title, { color: '#fff' }]}>Todo App</Text>
      </LinearGradient>
      
      <Text style={[styles.motto, { color: isDarkMode ? '#ddd' : '#555', fontSize: 20 }]}>
        Track your day and manage your time.
      </Text>

      <TextInput
        placeholder="Enter task"
        style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff' }]}
        value={task}
        onChangeText={setTask}
      />
      
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.button}>
        <LinearGradient colors={['orange', 'purple', 'red']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Pick Time</Text>
        </LinearGradient>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      <TouchableOpacity onPress={addTask} style={styles.button}>
        <LinearGradient colors={['orange', 'purple', 'red']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Add Task</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleSwitch} />
      </View>

      <FlatList
        data={todoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: isDarkMode ? '#444' : '#fff' }]}>
            <Text style={{ color: isDarkMode ? '#fff' : '#000', textDecorationLine: item.completed ? 'line-through' : 'none' }}>
              {item.value} - {new Date(item.time).toLocaleTimeString()}
            </Text>
            <CheckBox
              checked={item.completed}
              onPress={() => toggleTaskCompletion(item.id)}
            />
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      <TouchableOpacity onPress={handleDeleteCompletedTasks} style={styles.button}>
        <LinearGradient colors={['orange', 'purple', 'red']} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>Delete Completed Tasks</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
    textAlign: 'center',
  },
  motto: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonGradient: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;









