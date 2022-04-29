import 'package:flutter/material.dart';
import 'package:gratitude/app.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _serverController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("登录")),
      body: Container(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            TextField(
              controller: _serverController,
              decoration: const InputDecoration(
                hintText: '请输入服务器地址',
                labelText: '服务器',
              ),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(
                hintText: '请输入密码',
                labelText: '密码',
              ),
              obscureText: true,
            ),
            const SizedBox(
              height: 16,
            ),
            ElevatedButton(
              child: const Text('登录'),
              onPressed: () async {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => const MyHomePage()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
