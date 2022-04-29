import 'package:flutter/material.dart';

class TransportPage extends StatefulWidget {
  const TransportPage({Key? key}) : super(key: key);

  @override
  _TransportPageState createState() => _TransportPageState();
}

class _TransportPageState extends State<TransportPage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text("文件传输"),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Text("下载")),
              Tab(child: Text("上传")),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            Icon(Icons.download),
            Icon(Icons.upload),
          ],
        ),
      ),
    );
  }
}
