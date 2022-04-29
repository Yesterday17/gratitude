import 'package:badges/badges.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:gratitude/global.dart';
import 'package:gratitude/pages/transport.dart';
import 'package:gratitude/services/transfer.dart';

class TransferButton extends StatefulWidget {
  const TransferButton({Key? key}) : super(key: key);

  @override
  _TransferButtonState createState() => _TransferButtonState();
}

class _TransferButtonState extends State<TransferButton> {
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<List<TransferItem>>(
      valueListenable: Global.transferNotifier,
      builder: (context, value, child) {
        final length = value.where((element) => !element.isDone).length;
        return Badge(
          badgeContent: length == 0 ? null : Text("$length"),
          child: child,
        );
      },
      child: IconButton(
        icon: const Icon(CupertinoIcons.arrow_up_arrow_down),
        onPressed: () {
          // 跳转到传输界面
          Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => const TransportPage()));
        },
      ),
    );
  }
}
