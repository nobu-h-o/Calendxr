import 'package:flutter/material.dart';
import 'calendar_page.dart';

class AddEventDialog extends StatefulWidget {
  final Function(Event) onAddEvent;

  const AddEventDialog({Key? key, required this.onAddEvent}) : super(key: key);

  @override
  _AddEventDialogState createState() => _AddEventDialogState();
}

class _AddEventDialogState extends State<AddEventDialog> {
  final _titleController = TextEditingController();
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add New Event'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: _titleController,
            decoration: const InputDecoration(labelText: 'Event Title'),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Text('Date: '),
              TextButton(
                onPressed: () async {
                  final pickedDate = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate,
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                  );
                  if (pickedDate != null) {
                    setState(() {
                      _selectedDate = pickedDate;
                    });
                  }
                },
                child: Text('${_selectedDate.toLocal()}'.split(' ')[0]),
              ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_titleController.text.isNotEmpty) {
              widget.onAddEvent(
                Event(date: _selectedDate, title: _titleController.text),
              );
              Navigator.of(context).pop();
            }
          },
          child: const Text('Add Event'),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }
}
