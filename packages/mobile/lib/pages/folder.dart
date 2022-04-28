import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:gratitude/global.dart';
import 'package:webdav_client/webdav_client.dart';
import 'package:path/path.dart' as p;

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
      final List<File> files = await Global.client.readDir(path);
      files.removeWhere((element) =>
          !showHiddenFiles ? element.name!.startsWith(".") : false);
      print(path);
      if (path != "/") {
        files.insert(0, File(name: "..", isDir: true));
      }
      setState(() {
        content.replaceRange(0, content.length, files);
      });
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
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
    );
  }
}
