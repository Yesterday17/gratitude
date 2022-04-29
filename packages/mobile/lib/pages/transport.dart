import 'package:flutter/material.dart';
import 'package:gratitude/global.dart';
import 'package:gratitude/services/transfer.dart';
import 'package:open_file/open_file.dart';

class TransportPage extends StatefulWidget {
  const TransportPage({Key? key}) : super(key: key);

  @override
  _TransportPageState createState() => _TransportPageState();
}

class _TransportPageState extends State<TransportPage> {
  Widget _downloadList(List<TransferItem> all) {
    final data = all.where((element) => !element.isUpload).toList();

    return ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        return ListTile(
          leading: const Icon(Icons.cloud_download),
          title: Text(data[index].name),
          trailing: data[index].progress == 100
              ? const Icon(Icons.check)
              : Text("${data[index].progress}%"),
          onTap: () {
            if (data[index].isDone) {
              // 已完成
              OpenFile.open(data[index].path);
            }
          },
        );
      },
    );
  }

  Widget _uploadList(List<TransferItem> all) {
    final data = all.where((element) => element.isUpload).toList();

    return ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        return ListTile(
          leading: const Icon(Icons.cloud_download),
          title: Text(data[index].name),
          trailing: data[index].progress == 100
              ? const Icon(Icons.check)
              : Text("${data[index].progress}%"),
        );
      },
    );
  }

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
        body: ValueListenableBuilder<List<TransferItem>>(
          valueListenable: Global.transferNotifier,
          builder: (context, value, child) {
            return TabBarView(
              children: [
                _downloadList(value),
                _uploadList(value),
              ],
            );
          },
        ),
      ),
    );
  }
}
