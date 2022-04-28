import 'package:flutter/material.dart';
import 'package:wechat_assets_picker/wechat_assets_picker.dart';

class PhotoPage extends StatefulWidget {
  const PhotoPage({Key? key}) : super(key: key);

  @override
  _PhotoPageState createState() => _PhotoPageState();
}

class _PhotoPageState extends State<PhotoPage> {
  @override
  void initState() {
    super.initState();
    (() async {
      final List<AssetEntity>? result = await AssetPicker.pickAssets(context);
    })();
  }

  @override
  Widget build(BuildContext context) {
    // return AssetPicker(builder: );
    return Container();
  }
}
