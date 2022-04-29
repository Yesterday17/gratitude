import 'package:flutter/foundation.dart';
import 'package:gratitude/global.dart';

class TransferItem {
  bool isUpload;
  String name;
  int progress;
  String path;

  TransferItem({
    required this.isUpload,
    required this.name,
    required this.path,
    this.progress = 0,
  });

  factory TransferItem.upload(String name, String path) {
    return TransferItem(
      isUpload: true,
      name: name,
      path: path,
    );
  }

  factory TransferItem.download(String name, String path) {
    return TransferItem(
      isUpload: false,
      name: name,
      path: path,
    );
  }

  get isDone => progress == 100;

  updateProgress(int progress) {
    this.progress = progress;
    Global.transferNotifier.update();
  }
}

class TransferNotifier extends ValueNotifier<List<TransferItem>> {
  TransferNotifier() : super([]);

  add(TransferItem item) {
    value.add(item);
    notifyListeners();
  }

  update() {
    notifyListeners();
  }
}
