import 'package:flutter/material.dart';
import 'calendar_page.dart';
import 'day_widget.dart';

class CalendarWidget extends StatelessWidget {
  final DateTime currentDate;
  final List<Event> events;
  final VoidCallback onAddEvent;

  const CalendarWidget({
    Key? key,
    required this.currentDate,
    required this.events,
    required this.onAddEvent,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final daysInMonth =
        DateTime(currentDate.year, currentDate.month + 1, 0).day;
    final firstDayOfMonth =
        DateTime(currentDate.year, currentDate.month, 1).weekday;
    final days = List.generate(daysInMonth, (index) => index + 1);

    return Column(
      children: [
        _buildWeekdayHeader(),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              childAspectRatio: 1,
            ),
            itemCount: 42, // 6 weeks * 7 days
            itemBuilder: (context, index) {
              if (index < firstDayOfMonth - 1 ||
                  index >= firstDayOfMonth - 1 + daysInMonth) {
                return Container();
              }
              final day = days[index - (firstDayOfMonth - 1)];
              final date = DateTime(currentDate.year, currentDate.month, day);
              final dayEvents =
                  events
                      .where(
                        (event) =>
                            event.date.year == date.year &&
                            event.date.month == date.month &&
                            event.date.day == date.day,
                      )
                      .toList();
              return DayWidget(
                date: date,
                events: dayEvents,
                onAddEvent: onAddEvent,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildWeekdayHeader() {
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children:
          weekdays
              .map(
                (day) => Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    alignment: Alignment.center,
                    child: Text(
                      day,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              )
              .toList(),
    );
  }
}
