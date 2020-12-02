let HowToReadABook = {
  _bundle: Cc["@mozilla.org/intl/stringbundle;1"]
    .getService(Components.interfaces.nsIStringBundleService)
    .createBundle("chrome://HowToReadABook/locale/HowToReadABook.properties"),
};

let isDebug = function () {
  return (
    typeof Zotero !== "undefined" &&
    typeof Zotero.Debug !== "undefined" &&
    Zotero.Debug.enabled
  );
};

function debug(msg, err) {
  if (err) {
    Zotero.debug(`{Zutilo} ${new Date()} error: ${msg} (${err} ${err.stack})`);
  } else {
    Zotero.debug(`{Zutilo} ${new Date()}: ${msg}`);
  }
}

HowToReadABook.init = function () {
  // Register the callback in Zotero as an item observer
  let notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, [
    "item",
  ]);

  document
    .getElementById("zotero-itemmenu")
    .addEventListener(
      "popupshowing",
      this.refreshZoteroItemPopup.bind(this),
      false
    );

  this.initPrefs();

  // Unregister callback when the window closes (important to avoid a memory leak)
  window.addEventListener(
    "unload",
    function (e) {
      Zotero.Notifier.unregisterObserver(notifierID);

      document
        .getElementById("zotero-itemmenu")
        .removeEventListener(
          "popupshowing",
          this.refreshZoteroItemPopup.bind(this),
          false
        );
    },
    false
  );
};

HowToReadABook.refreshZoteroItemPopup = function () {
  var zitems1 = this.getSelectedItems("regular");
  var isRegular = zitems1 && zitems1.length > 0;
  var onlyOne = zitems1 && zitems1.length === 1;
  var hidden = !isRegular || !onlyOne;

  document.getElementById("zotero-itemmenu-HowToReadABook-inspectionalreading").hidden = hidden;
  document.getElementById("zotero-itemmenu-HowToReadABook-analyticalreading").hidden = hidden;
  document.getElementById("zotero-itemmenu-HowToReadABook-syntopicalreading").hidden = hidden;
  document.getElementById("zotero-itemmenu-HowToReadABook-structuralnotemaking").hidden = hidden;
  document.getElementById("zotero-itemmenu-HowToReadABook-conceptualnotemaking").hidden = hidden;
  document.getElementById("zotero-itemmenu-HowToReadABook-concentratenotemaking").hidden = hidden;
};

HowToReadABook.initPrefs = function (item) {
  var pref;
  switch (item) {
    case "inspectionalreading":
      pref = Zotero.Prefs.get("HowToReadABook.inspectionalreading");
      if (!pref) {
        pref =
          '<h3>Ⅱ. 检视阅读</h3>\\n<hr /><p><strong>阶段一 </strong>：系统略读。<span style="color: #808080;">(完成请打✔️，无请打➖。)</span><br />&nbsp;&nbsp;&nbsp;&nbsp;1. 看书名页、序——了解作者的相关说明或宗旨。<br />&nbsp;&nbsp;&nbsp;&nbsp;2. 研究目录页——对书的基本框架做概括性的理解。<br />&nbsp;&nbsp;&nbsp;&nbsp;3. 检阅索引——快速评估本书涵盖哪些议题的范围、书籍种类与作者等等。<br />&nbsp;&nbsp;&nbsp;&nbsp;4. 读出版者的介绍——是否吹嘘有助于了解本书。<br />&nbsp;&nbsp;&nbsp;&nbsp;5. 读几个跟主题息息相关的篇章——读篇章开头或结尾的摘要说明来了解主题。<br />&nbsp;&nbsp;&nbsp;&nbsp;6. 东翻翻西翻翻，念一两段，或连续读几页——随时寻找主要论点的讯号，留意主题的基本脉动。<br /><strong>&nbsp;&nbsp;&nbsp;&nbsp;结论：<br /></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 这本书值不值得多花时间细读：<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 本书的架构是什么：</p><p><strong>阶段二</strong>：粗浅阅读，了解全书的内容：</p><p><strong>出处</strong>：{authors}《{title}》({year})</p><p><strong>日期</strong>：{today}</p>';
        Zotero.Prefs.set("HowToReadABook.inspectionalreading", pref);
      }
      break;
    case "analyticalreading":
      pref = Zotero.Prefs.get("HowToReadABook.analyticalreading");
      if (!pref) {
        pref =
          '<h3>Ⅲ. 分析阅读<strong></strong></h3>\\n<hr /><p><strong>第一阶段：架构规则。</strong><br />1. 书籍分类：<span style="color: #999999;">理论性：历史、科学（心理学、几何学、物理学）和哲学；实用性：技巧、实用手册、教导。</span><br />2. 整本书在谈些什么：<span style="color: #999999;">一两句话或一小段话说。</span><br />3. 整体的架构<span style="color: #999999;">：（1）作者将全书分成五个部分，第一部分谈的是什么，第二部分谈的是什么，第三部分谈的是别的事，第四部分则是另外的观点，第五部分又是另一些事。（2）第一个主要的部分又分成三个段落，第一段落为X，第二段落为Y，第三段落为Z。（3）在第一部分的第一阶段，作者有四个重点，第一个重点是A，第二个重点是B，第三个重点是C，第四个重点是D等等。</span><br />4. 确定作者想要解决的问题：<span style="color: #999999;">找出作者要问的问题。</span><strong></strong></p><p><strong>第二阶段：诠释规则。</strong><br />5. 诠释作者使用的关键字：<span style="color: #999999;">找出重要单字，透过它们与作者达成共识。</span><br />6. 由最重要的句子中，抓住作者的重要主旨：<span style="color: #999999;">将一本书中最重要的句子圈出来，找出其中的主旨。</span><br />7. 知道作者的论述是什么，从内容中找出相关的句子，再重新架构出来。<span style="color: #999999;">从相关文句的关联中，架构出一本书的基本论述。</span><br />8. 确认作者已经解决了哪些问题，还有哪些是没解决的：<span style="color: #999999;">找出作者的解答。</span></p><p><strong>第三阶段：批评规则(请确保自己“了解”后再再评价)。</strong><br />9. 除非你已经完成大纲架构，也能诠释整本书了，否则不要轻易批评。<br />10. 不要争强好胜，非辩到底不可。<br />11. 在说出评论之前，你要能证明自己区别得出真正的知识与个人观点的不同。<br />12. 证明作者的知识不足：<span style="color: #999999;">缺少某些相关的知识</span><br />13. 证明作者的知识错误：<span style="color: #999999;">理念不正确</span><br />14. 证明作者不合逻辑：<span style="color: #999999;">推论荒谬</span><br />15. 证明作者的分析与理由是不完整的：<span style="color: #999999;">并没有解决提出的问题<br /></span></p><p><strong>四个问题：</strong><br />1. 这整本书的内容是在谈些什么：<span style="color: #999999;">根据第一阶段总结</span><br />2. 内容的细节是什么？是如何表现出来的：<span style="color: #999999;">根据第二阶段总结</span><br />3. 这本书说的是真实的吗？全部真实或部分真实：<span style="color: #999999;">根据第三阶段总结</span><br />4. 这本书与我何干：<span style="color: #999999;">综合总结</span></p><p><strong>出处：</strong>{authors}《{title}》({year})</p><p><strong>日期：</strong>{today}</p>';
        Zotero.Prefs.set("HowToReadABook.analyticalreading", pref);
      }
      break;
    case "syntopicalreading":
      pref = Zotero.Prefs.get("HowToReadABook.syntopicalreading");
      if (!pref) {
        pref =
          '<h3>Ⅳ. 主题阅读<strong></strong></h3>\\n<hr /><p><strong>主题：</strong><br /><span style="color: #999999;">待研究的主题描述</span><br /><strong></strong></p><p><strong>议题：<br /></strong>1. <span style="color: #999999;">问题1</span>：<span style="color: #999999;">回答1</span><br />2. <span style="color: #999999;">问题2</span>：<span style="color: #999999;">回答2<br /></span>3. <span style="color: #999999;">...<br /></span></p><p><strong>书单：<br /></strong>1. 《<span style="color: #999999;">书名1</span>》：第<span style="color: #999999;">几</span>章 P<span style="color: #999999;">页码</span><br />2. 《<span style="color: #999999;">书名2</span>》：第<span style="color: #999999;">几</span>章 P<span style="color: #999999;">页码<br /></span>3. <span style="color: #999999;">...<br /></span><strong></strong></p><p><strong>结论：</strong><br /><span style="color: #999999;">对于主题或议题的结论</span></p><p><strong>出处</strong>：{authors}《{title}》({year})</p><p><strong>日期</strong>：{today}</p>';
        Zotero.Prefs.set("HowToReadABook.syntopicalreading", pref);
      }
      break;
    case "structuralnotemaking":
      pref = Zotero.Prefs.get("HowToReadABook.structuralnotemaking");
      if (!pref) {
        pref =
          '<h3>结构笔记 - <span style="color: #999999;">全书/第几章/某一个主题</span></h3>\\n<hr /><p><strong>结构</strong>：<br />1. <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;(1) <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;(2) <span style="color: #bbbbbb;">...</span><br />&nbsp;&nbsp;&nbsp;&nbsp;(3) <span style="color: #bbbbbb;">...</span><br />2. <span style="color: #bbbbbb;">...</span><br />3. <span style="color: #bbbbbb;">...</span></p><p><strong>笔记</strong>：</p><p><strong>出处</strong>：{authors}《{title}》({year})</p><p><strong>日期</strong>：{today}</p>';
        Zotero.Prefs.set("HowToReadABook.structuralnotemaking", pref);
      }
      break;
    case "conceptualnotemaking":
      pref = Zotero.Prefs.get("HowToReadABook.conceptualnotemaking");
      if (!pref) {
        pref =
          '<h3>概念笔记 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<hr /><p><strong>提出者</strong>：<span style="color: #bbbbbb;">&lt;姓名&gt;</span>, <span style="color: #bbbbbb;">&lt;年份&gt;</span></p><p><strong>描述</strong>：<span style="color: #bbbbbb;">&lt;具体描述或摘抄&gt;</span></p><p><strong>笔记</strong>：</p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p><strong>日期</strong>：{today}</p>';
        Zotero.Prefs.set("HowToReadABook.conceptualnotemaking", pref);
      }
      break;
    case "concentratenotemaking":
      pref = Zotero.Prefs.get("HowToReadABook.concentratenotemaking");
      if (!pref) {
        pref =
          '<h3>重点笔记 - <span style="color: #bbbbbb;">&lt;标题&gt;</span></h3>\\n<hr /><p><strong>原文</strong>：<span style="color: #bbbbbb;">&lt;摘抄&gt;</span></p><p><strong>笔记</strong>：</p><p><strong>出处</strong>：{authors}《{title}》({year}) P<span style="color: #bbbbbb;">&lt;页码&gt;</span></p><p><strong>日期</strong>：{today}</p>';
        Zotero.Prefs.set("HowToReadABook.concentratenotemaking", pref);
      }
      break;
    default:
      this.initPrefs("inspectionalreading");
      this.initPrefs("analyticalreading");
      this.initPrefs("syntopicalreading");
      this.initPrefs("structuralnotemaking");
      this.initPrefs("conceptualnotemaking");
      this.initPrefs("concentratenotemaking");
      break;
  }

  return pref;
};

// so citation counts will be queried for >all< items that are added to zotero!? o.O
HowToReadABook.notifierCallback = {
  notify: function (event, type, ids, extraData) {
    // 新增
    if (isDebug()) Zotero.debug("event: " + JSON.stringify(event));
    if (isDebug()) Zotero.debug("type: " + JSON.stringify(type));
    if (isDebug()) Zotero.debug("ids: " + JSON.stringify(ids));
    if (isDebug()) Zotero.debug("extraData: " + JSON.stringify(extraData));
    if (event === "add") {
    } else if (event === "edit") {
    }
  },
};

HowToReadABook.newCard = async function (name) {
  var zitems = this.getSelectedItems("regular");
  if (!zitems || zitems.length <= 0) {
    var ps = Components.classes[
      "@mozilla.org/embedcomp/prompt-service;1"
    ].getService(Components.interfaces.nsIPromptService);
    ps.alert(
      window,
      this.getString("HowToReadABook.warning"),
      this.getString("HowToReadABook.unsupported_entries")
    );
    return;
  }
  if (zitems.length !== 1) {
    var ps = Components.classes[
      "@mozilla.org/embedcomp/prompt-service;1"
    ].getService(Components.interfaces.nsIPromptService);
    ps.alert(
      window,
      this.getString("HowToReadABook.warning"),
      this.getString("HowToReadABook.only_one")
    );
    return;
  }

  var zitem = zitems[0];
  var creatorsData = zitem.getCreators();
  var authors = [];
  var creatorTypeAuthor = Zotero.CreatorTypes.getID("author");
  for (let i = 0; i < creatorsData.length; i++) {
    let creatorTypeID = creatorsData[i].creatorTypeID;
    let creatorData = creatorsData[i];
    if (creatorTypeID === creatorTypeAuthor) {
      authors.push(creatorData.lastName || creatorData.firstName);
      if (isDebug())
        Zotero.debug("creatorData: " + JSON.stringify(creatorData));
    }
  }
  var date = new Date();
  var item = new Zotero.Item("note");
  var pref = this.initPrefs(name);
  if (!pref) {
    var ps = Components.classes[
      "@mozilla.org/embedcomp/prompt-service;1"
    ].getService(Components.interfaces.nsIPromptService);
    ps.alert(
      window,
      this.getString("HowToReadABook.warning"),
      this.getString("HowToReadABook.please_configure", "HowToReadABook." + name)
    );
    return;
  }
  item.setNote(
    pref
      .replace("{authors}", authors.toString())
      .replace("{title}", zitem.getField("title"))
      .replace("{today}", this.formatDate(date, "yyyy-MM-dd"))
      .replace("{now}", this.formatDate(date, "yyyy-MM-dd HH:mm:ss"))
      .replace("{shortTitle}", zitem.getField("shortTitle"))
      .replace("{archiveLocation}", zitem.getField("archiveLocation"))
      .replace("{url}", zitem.getField("url"))
      .replace("{date}", zitem.getField("date"))
      .replace("{year}", zitem.getField("year"))
      .replace("{extra}", zitem.getField("extra"))
      .replace("{publisher}", zitem.getField("publisher"))
      .replace("{ISBN}", zitem.getField("ISBN"))
      .replace("{numPages}", zitem.getField("numPages"))
      .replace("\\n", "\n")
  );
  item.parentKey = zitem.getField("key");
  var itemID = await item.saveTx();
  if (isDebug()) Zotero.debug("item.id: " + itemID);
  ZoteroPane.selectItem(itemID);
};

HowToReadABook.inspectionalreading = function () {
  this.newCard("inspectionalreading");
};

HowToReadABook.analyticalreading = function () {
  this.newCard("analyticalreading");
};

HowToReadABook.syntopicalreading = function () {
  this.newCard("syntopicalreading");
};

HowToReadABook.conceptualnotemaking = function () {
  this.newCard("conceptualnotemaking");
};
HowToReadABook.structuralnotemaking = function () {
  this.newCard("structuralnotemaking");
};
HowToReadABook.concentratenotemaking = function () {
  this.newCard("concentratenotemaking");
};









HowToReadABook.copyHtmlToClipboard = function (textHtml) {
  var htmlstring = Components.classes[
    "@mozilla.org/supports-string;1"
  ].createInstance(Components.interfaces.nsISupportsString);
  if (!htmlstring) return false;
  htmlstring.data = textHtml;

  var trans = Components.classes[
    "@mozilla.org/widget/transferable;1"
  ].createInstance(Components.interfaces.nsITransferable);
  if (!trans) return false;

  trans.addDataFlavor("text/html");
  trans.setTransferData("text/html", htmlstring, textHtml.length * 2);

  var clipboard = Components.classes[
    "@mozilla.org/widget/clipboard;1"
  ].getService(Components.interfaces.nsIClipboard);
  if (!clipboard) return false;

  clipboard.setData(
    trans,
    null,
    Components.interfaces.nsIClipboard.kGlobalClipboard
  );
  return true;
};

HowToReadABook.copyStringToClipboard = function (clipboardText) {
  const gClipboardHelper = Components.classes[
    "@mozilla.org/widget/clipboardhelper;1"
  ].getService(Components.interfaces.nsIClipboardHelper);
  gClipboardHelper.copyString(clipboardText, document);
};

HowToReadABook.getString = function (name, ...params) {
  if (params !== undefined) {
    return this._bundle.formatStringFromName(name, params, params.length);
  } else {
    return this._bundle.GetStringFromName(name);
  }
};

HowToReadABook.getSelectedItems = function (itemType) {
  var zitems = window.ZoteroPane.getSelectedItems();
  if (!zitems.length) {
    if (isDebug()) Zotero.debug("zitems.length: " + zitems.length);
    return false;
  }

  if (itemType) {
    if (!Array.isArray(itemType)) {
      itemType = [itemType];
    }
    var siftedItems = this.siftItems(zitems, itemType);
    if (isDebug()) Zotero.debug("siftedItems.matched: " + siftedItems.matched);
    return siftedItems.matched;
  } else {
    return zitems;
  }
};

HowToReadABook.siftItems = function (itemArray, itemTypeArray) {
  var matchedItems = [];
  var unmatchedItems = [];
  while (itemArray.length > 0) {
    if (this.checkItemType(itemArray[0], itemTypeArray)) {
      matchedItems.push(itemArray.shift());
    } else {
      unmatchedItems.push(itemArray.shift());
    }
  }

  return {
    matched: matchedItems,
    unmatched: unmatchedItems,
  };
};

HowToReadABook.checkItemType = function (itemObj, itemTypeArray) {
  var matchBool = false;

  for (var idx = 0; idx < itemTypeArray.length; idx++) {
    switch (itemTypeArray[idx]) {
      case "attachment":
        matchBool = itemObj.isAttachment();
        break;
      case "note":
        matchBool = itemObj.isNote();
        break;
      case "regular":
        matchBool = itemObj.isRegularItem();
        break;
      default:
        matchBool =
          Zotero.ItemTypes.getName(itemObj.itemTypeID) === itemTypeArray[idx];
    }

    if (matchBool) {
      break;
    }
  }

  return matchBool;
};

HowToReadABook.formatDate = function (date, format) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "load",
    function (e) {
      HowToReadABook.init();
    },
    false
  );

  // API export for Zotero UI
  // Can't imagine those to not exist tbh
  if (!window.Zotero) window.Zotero = {};
  if (!window.Zotero.HowToReadABook) window.Zotero.HowToReadABook = {};
  // note sure about any of this
  window.Zotero.HowToReadABook.inspectionalreading = function () {
    HowToReadABook.inspectionalreading();
  };
  window.Zotero.HowToReadABook.analyticalreading = function () {
    HowToReadABook.analyticalreading();
  };
  window.Zotero.HowToReadABook.syntopicalreading = function () {
    HowToReadABook.syntopicalreading();
  };
  window.Zotero.HowToReadABook.conceptualnotemaking = function () {
    HowToReadABook.conceptualnotemaking();
  };
  window.Zotero.HowToReadABook.structuralnotemaking = function () {
    HowToReadABook.structuralnotemaking();
  };
  window.Zotero.HowToReadABook.concentratenotemaking = function () {
    HowToReadABook.concentratenotemaking();
  };
}

if (typeof module !== "undefined") module.exports = HowToReadABook;
