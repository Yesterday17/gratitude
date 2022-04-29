import 'package:flutter/material.dart';
import 'package:gratitude/global.dart';
import 'package:gratitude/pages/login.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        ListTile(
          title: const Text("退出登录"),
          onTap: () async {
            // 1. 清除本地存储的登录信息
            await Global.logout();
            // 2. 重新跳转到登录页面
            Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const LoginPage()));
          },
        )
      ],
    );
  }
}
