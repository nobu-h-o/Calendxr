import 'package:flutter/material.dart';
import 'calendar_page.dart';

class DayWidget extends StatelessWidget {
  final DateTime date;
  final List<Event> events;
  final VoidCallback onAddEvent;

  const DayWidget({
    super.key,
    required this.date,
    required this.events,
    required this.onAddEvent,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onAddEvent,
      child: Container(
        decoration: BoxDecoration(border: Border.all(color: Colors.grey[300]!)),
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(4.0),
                child: Text(
                  '${date.day}',
                  style: TextStyle(
                    fontWeight:
                        date.day == DateTime.now().day &&
                                date.month == DateTime.now().month &&
                                date.year == DateTime.now().year
                            ? FontWeight.bold
                            : FontWeight.normal,
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: events.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 4.0,
                      vertical: 2.0,
                    ),
                    child: Text(
                      events[index].title,
                      style: const TextStyle(fontSize: 10),
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
