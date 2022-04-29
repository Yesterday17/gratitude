import 'package:flutter/foundation.dart';
import 'package:gratitude/global.dart';

class TransferItem {
  bool isUpload;
  String name;
  int progress;

  TransferItem({
    required this.isUpload,
    required this.name,
    this.progress = 0,
  });

  factory TransferItem.upload(String name) {
    return TransferItem(
      isUpload: true,
      name: name,
    );
  }

  factory TransferItem.download(String name) {
    return TransferItem(
      isUpload: false,
      name: name,
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
