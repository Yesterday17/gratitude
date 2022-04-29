import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:gratitude/pages/folder.dart';
import 'package:gratitude/pages/settings.dart';
import 'package:gratitude/pages/transport.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;
  static final List<Widget> _widgetOptions = <Widget>[
    Builder(builder: (context) {
      return const FolderView();
    }),
    const SettingsPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Gratitude"),
        actions: [
          IconButton(
            icon: const Icon(CupertinoIcons.arrow_up_arrow_down),
            onPressed: () {
              // 跳转到传输界面
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const TransportPage()));
            },
          ),
        ],
      ),
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.cloud_outlined),
            label: '文件',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: '设置',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
