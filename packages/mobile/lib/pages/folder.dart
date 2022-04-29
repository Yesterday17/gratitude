import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:gratitude/global.dart';
import 'package:gratitude/pages/transport.dart';
import 'package:webdav_client/webdav_client.dart';
import 'package:path/path.dart' as p;
import 'package:hawk_fab_menu/hawk_fab_menu.dart';
import 'package:wechat_assets_picker/wechat_assets_picker.dart';

class FolderView extends StatefulWidget {
  const FolderView({Key? key}) : super(key: key);

  @override
  _FolderViewState createState() => _FolderViewState();
}

class _FolderViewState extends State<FolderView> {
  List<File> content = [];
  String path = "/";
  bool loading = true;
  bool showHiddenFiles = false;

  @override
  void initState() {
    super.initState();
    readDir();
  }

  void readDir() async {
    try {
      setState(() {
        loading = true;
      });
      final List<File> files = await Global.client.readDir(path);
      files.removeWhere((element) =>
          !showHiddenFiles ? element.name!.startsWith(".") : false);
      if (path != "/") {
        files.insert(0, File(name: "..", isDir: true));
      }
      content.replaceRange(0, content.length, files);
      setState(() {
        loading = false;
      });
    } catch (e) {
      setState(() {
        loading = false;
      });
      if (kDebugMode) {
        print(e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return loading
        ? const Center(child: CircularProgressIndicator())
        : HawkFabMenu(
            icon: AnimatedIcons.add_event,
            items: [
              HawkFabMenuItem(
                label: '上传图片',
                icon: const Icon(Icons.image),
                ontap: () async {
                  try {
                    final result = await AssetPicker.pickAssets(context);
                    // 1. TODO: 上传
                    print(result);
                    // 2. 跳转到传输界面
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => const TransportPage()));
                  } catch (e) {
                    // 忽略错误
                  }
                },
              ),
              HawkFabMenuItem(
                label: '上传文件',
                icon: const Icon(Icons.upload),
                ontap: () async {
                  try {
                    FilePickerResult? result =
                        await FilePicker.platform.pickFiles();
                    if (result != null) {
                      // 1. TODO: 上传
                      print(result.files.single.path);
                      // 2. 跳转到传输界面
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const TransportPage()));
                    } else {
                      // 用户取消了选择
                    }
                  } catch (e) {
                    // 忽略错误
                  }
                },
              ),
            ],
            body: ListView.builder(
              itemBuilder: (context, index) {
                final item = content[index];
                return ListTile(
                  leading: item.isDir ?? false
                      ? const Icon(Icons.folder)
                      : const Icon(Icons.insert_drive_file),
                  title: Text(item.name!),
                  onTap: () {
                    if (item.isDir!) {
                      path = p.normalize(p.join(path, item.name!));
                      readDir();
                    } else {
                      // TODO: open file
                    }
                  },
                );
              },
              itemCount: content.length,
            ),
          );
  }
}
