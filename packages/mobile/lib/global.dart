import 'package:flutter/foundation.dart';
import 'package:gratitude/models/transfer_item.dart';
import 'package:webdav_client/webdav_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Global {
  static late SharedPreferences preferences;

  static late Client client;

  static String? server;
  static String? authKey;
  static String? authSecret;

  static ValueNotifier<List<TransferItem>> transferNotifier = ValueNotifier([]);

  static Future<void> init() async {
    // 持久化配置
    preferences = await SharedPreferences.getInstance();

    server = preferences.getString("server") ??
        "http://192.168.1.9:3010/MgKq_VIb4BLr5hnxdkjzDw";
    authKey = preferences.getString("authKey") ?? "";
    authSecret = preferences.getString("authSecret") ?? "";
    const driveId = 1;

    if (server != null && authKey != null && authSecret != null) {
      // is login, set client
      client = newClient("$server/drive/$driveId");
    }
  }

  static bool isLogin() {
    return false;
  }

  static Future<void> logout() async {
    await preferences.remove("server");
    await preferences.remove("authKey");
    await preferences.remove("authSecret");
  }
}
