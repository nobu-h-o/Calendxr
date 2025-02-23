import 'package:flutter/material.dart';
import 'calendar_widget.dart';
import 'add_event_dialog.dart';

class CalendarPage extends StatefulWidget {
  const CalendarPage({Key? key}) : super(key: key);

  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  DateTime _currentDate = DateTime.now();
  List<Event> _events = [];

  void _addEvent(Event event) {
    setState(() {
      _events.add(event);
    });
  }

  void _showAddEventDialog() {
    showDialog(
      context: context,
      builder: (context) => AddEventDialog(onAddEvent: _addEvent),
    );
  }

  void _previousMonth() {
    setState(() {
      _currentDate = DateTime(_currentDate.year, _currentDate.month - 1, 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _currentDate = DateTime(_currentDate.year, _currentDate.month + 1, 1);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '${_getMonthName(_currentDate.month)} ${_currentDate.year}',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: _previousMonth,
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: _nextMonth,
          ),
        ],
      ),
      body: CalendarWidget(
        currentDate: _currentDate,
        events: _events,
        onAddEvent: _showAddEventDialog,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddEventDialog,
        child: const Icon(Icons.add),
      ),
    );
  }

  String _getMonthName(int month) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month - 1];
  }
}

class Event {
  final DateTime date;
  final String title;

  Event({required this.date, required this.title});
}
