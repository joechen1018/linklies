-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 建立日期: Feb 23, 2014, 10:51 AM
-- 伺服器版本: 5.1.41
-- PHP 版本: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫: `linklies`
--

-- --------------------------------------------------------

--
-- 資料表格式： `folders`
--

CREATE TABLE IF NOT EXISTS `folders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(255) NOT NULL,
  `folder_type_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `grid` varchar(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `icon` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 列出以下資料庫的數據： `folders`
--

INSERT INTO `folders` (`id`, `hash`, `folder_type_id`, `name`, `grid`, `user_id`, `type`, `icon`) VALUES
(1, '', 1, 'Lorem ipsum dolor sit amet sit amet Lorem', '0,0', 1, '', 'a'),
(2, '', 2, 'Lorem ipsum dolor sit amet sit amet Lorem', '1,0', 1, 'video', 'l');

-- --------------------------------------------------------

--
-- 資料表格式： `folder_types`
--

CREATE TABLE IF NOT EXISTS `folder_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- 列出以下資料庫的數據： `folder_types`
--

INSERT INTO `folder_types` (`id`, `name`, `icon`) VALUES
(1, 'web', 'a'),
(2, 'video', 'l');

-- --------------------------------------------------------

--
-- 資料表格式： `links`
--

CREATE TABLE IF NOT EXISTS `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `folder_id` int(11) NOT NULL,
  `username_id` varchar(255) NOT NULL,
  `grid` varchar(10) NOT NULL,
  `ico` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `site` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  `html_source` text NOT NULL,
  `hash` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=166 ;

--
-- 列出以下資料庫的數據： `links`
--

INSERT INTO `links` (`id`, `user_id`, `folder_id`, `username_id`, `grid`, `ico`, `url`, `title`, `thumb`, `site`, `desc`, `html_source`, `hash`, `timestamp`) VALUES
(13, 1, 0, 'joe.chen.1', '4,12', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/gadgets/docs/remote-content', 'Working with Remote Content - Gadgets API — Google Developers', '', '', '', '', '', '2014-02-09 10:51:58'),
(14, 1, 0, 'joe.chen.1', '6,11', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=rp9sYmnoFEU&list=RDeWnHL-M8g3g', 'Nina Nesbitt - Little Lion Man (David Keller Remix)', '', '', '', '', '', '2014-02-09 10:51:58'),
(103, 1, 0, 'joe.chen.1', '5,13', 'https://www.google.com.tw/favicon.ico', 'https://www.google.com.tw/search?q=angularjs+post+not+getting+data&oq=angularjs+post+not+getting+data&aqs=chrome..69i57.8650j0j7&sourceid=chrome&espv=210&es_sm=122&ie=UTF-8', 'angularjs post not getting data - Google 搜尋', '', '', '', '', '', '2014-02-10 13:29:53'),
(104, 1, 0, 'joe.chen.1', '4,8', 'http://victorblog.com/images/favicon.png', 'http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/', '  Make AngularJS $http service behave like jQuery.ajax() | Strength in Numbers Blog', '', '', '', '', '', '2014-02-10 13:31:18'),
(17, 1, 0, 'joe.chen.1', '1,7', 'http://cache.ettoday.net/lemon/images/favicon.ico', 'http://www.ettoday.net/dalemon/post/2136?from=fb_et_pets', '我雄赳赳的哈士奇美容後怎麼變這樣！', '', '', '', '', '', '2014-02-09 10:51:58'),
(9, 1, 0, 'joe.chen.1', '2,4', 'http://underscorejs.org/favicon.ico', 'http://underscorejs.org/', 'Underscore.js', '', '', '', '', '', '2014-02-09 10:51:58'),
(12, 1, 0, 'joe.chen.1', '5,2', 'http://github.com/favicon.ico', 'https://github.com/allmarkedup/purl', 'allmarkedup/purl', '', '', '', '', '', '2014-02-09 10:51:58'),
(122, 1, 0, 'joe.chen.1', '0,6', 'https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico', 'https://docs.google.com/document/d/12w8DGlz9JR3WLaxw0SBvv4RjkxMNf0Eg-rJjn6kO96U/edit', 'profile', '', '', '', '', '', '2014-02-12 02:31:59'),
(126, 1, 0, 'joe.chen.1', '2,1', '//d1y9yo7q4hy8a7.cloudfront.net/static/00033/core/20140127_1390790332/img/favicon_v2.png', 'http://9gag.com/gag/azbObBj', '9GAG - I thought they were scary when they were fuzzy.', '', '', '', '', '', '2014-02-12 02:54:29'),
(25, 1, 0, 'joe.chen.1', '7,2', 'http://taipei.kijiji.com.tw/favicon.ico', 'http://taipei.kijiji.com.tw/c-Goods-home-appliances-TV-CHIMEI-37-W0QQAdIdZ563079706', '嶔縊中古二手家電 CHIMEI 奇美 37吋 液晶電視 台北地區免運費 (實體店面)', '', '', '', '', '', '2014-02-09 10:51:58'),
(68, 1, 0, 'joe.chen.1', '5,5', 'http://lesscss.org/assets/favicon.ico', 'http://lesscss.org/#using-less-configuration', '\n  Getting started | Less.js\n', '', '', '', '', '', '2014-02-09 10:51:58'),
(27, 1, 0, 'joe.chen.1', '4,22', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/accounts/docs/OAuth2?hl=zh-TW', 'Using OAuth 2.0 to Access Google APIs - Google Accounts Authentication and Authorization — Google Developers', '', '', '', '', '', '2014-02-09 10:51:58'),
(30, 1, 0, 'joe.chen.1', '1,37', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://www.inside.com.tw/2014/02/01/10-month-old-startup-buys-93-year-old-business-for-100-million', '未滿一歲的新創公司，用 1 億美金買下百年企業', '', '', '', '', '', '2014-02-09 10:51:58'),
(31, 1, 0, 'joe.chen.1', '5,30', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-09 10:51:58'),
(32, 1, 0, 'joe.chen.1', '4,9', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-09 10:51:58'),
(33, 1, 0, 'joe.chen.1', '5,20', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-09 10:51:58'),
(135, 1, 0, 'joe.chen.1', '8,11', 'https://ssl.gstatic.com/docs/presentations/images/favicon4.ico', 'https://docs.google.com/presentation/d/1BC3qNEhi8TU17C75Q8ivhl3cpYL8odCEfh6lBJcCFrM/edit#slide=id.p', 'test title', '', '', '', '', '', '2014-02-12 03:09:36'),
(37, 1, 0, 'joe.chen.1', '2,9', '//d1nmj8esheg8s6.cloudfront.net/build/1390807413/img/favicon.ico', 'http://9gag.tv/v/163', 'Brilliant Way To Get Women To Exercise: Male Stripping | 9gag.tv', '', '', '', '', '', '2014-02-09 10:51:58'),
(110, 1, 0, 'joe.chen.1', '1,13', 'http://www.benlesh.com/favicon.ico', 'http://www.benlesh.com/2013/02/angularjs-creating-service-with-http.html', 'Try, Catch, Fail: AngularJS: Creating A Service With $http', '', '', '', '', '', '2014-02-10 14:15:40'),
(41, 1, 0, 'joe.chen.1', '1,5', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/accounts/docs/OAuth2?hl=zh-TW', 'Using OAuth 2.0 to Access Google APIs - Google Accounts Authentication and Authorization — Google Developers', '', '', '', '', '', '2014-02-09 10:51:58'),
(116, 1, 0, 'joe.chen.1', '7,4', 'http://docs.angularjs.org/favicon.ico', 'http://docs.angularjs.org/api/ng.$http', 'AngularJS', '', '', '', '', '', '2014-02-10 14:50:24'),
(117, 1, 0, 'joe.chen.1', '2,8', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=aU4YOOjUtcs&list=RDXm6rPrIJ0sE', 'Popof - Black Jesus - YouTube', '', '', '', '', '', '2014-02-10 15:27:31'),
(112, 1, 0, 'joe.chen.1', '4,4', 'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png', 'https://docs.google.com/spreadsheet/ccc?key=0AjJy4AXy73o_dHJnNk9BYVduQmRacncxX09PZHVGM2c&usp=drive_web#gid=0', '9x9.tv通訊錄', '', '', '', '', '', '2014-02-10 14:17:48'),
(44, 1, 0, 'joe.chen.1', '4,34', '//www.wolframcdn.com/images/alpha.fav.png', 'http://www.wolframalpha.com/input/?i=http%3A%2F%2Fjsfiddle.net%2F', ' http://jsfiddle.net/ - Wolfram|Alpha', '', '', '', '', '', '2014-02-09 10:51:58'),
(45, 1, 0, 'joe.chen.1', '4,6', '//d1y9yo7q4hy8a7.cloudfront.net/static/00028/core/20140127_1390790346/img/favicon_v2.png', 'http://9gag.com/gag/ay5WnVp', 'Son, your new tutor is here!', '', '', '', '', '', '2014-02-09 10:51:58'),
(47, 1, 0, 'joe.chen.1', '8,3', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://jobs.inside.com.tw/jobs/2961-%E7%B4%84%E8%81%98php%E7%B6%B2%E9%A0%81%E5%B7%A5%E7%A8%8B%E5%B8%AB-o2odate-llc', '約聘php網頁工程師 - O2ODATE LLC', '', '', '', '', '', '2014-02-09 10:51:58'),
(50, 1, 0, 'joe.chen.1', '3,10', 'http://blog.roodo.com/favicon.ico', 'http://blog.roodo.com/hhung/archives/26894880.html', '力爭下游的大叔詩人──讀許赫《原來女孩不想嫁給阿北》@鴻鴻的過氣兒童樂園', '', '', '', '', '', '2014-02-09 10:51:58'),
(66, 1, 0, 'joe.chen.1', '6,1', 'http://lesscss.org/assets/favicon.ico', 'http://lesscss.org/', '\n  Getting started | Less.js\n', '', '', '', '', '', '2014-02-09 10:51:58'),
(67, 1, 0, 'joe.chen.1', '6,3', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://share.inside.com.tw/posts/3840?ref=sidebar', 'Google 釋出 Chromecast SDK - Inside 網摘', '', '', '', '', '', '2014-02-09 10:51:58'),
(125, 1, 0, 'joe.chen.1', '6,6', 'https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico', 'https://docs.google.com/document/d/1hsdIH4O3FYmFPyWFMdl2lhvUziNRDYdo23DY_2dV35I/edit', 'exchange names', '', '', '', '', '', '2014-02-12 02:33:14'),
(70, 0, 0, '', '3,5', 'https://www.google.com.tw/favicon.ico', 'https://www.google.com.tw/search?espv=210&es_sm=122&q=google+oauth+how+to+know+user+is+logged+out&oq=google+oauth+how+to+know+user+is+logged+out&gs_l=serp.3...70284.73595.0.73858.20.16.4.0.0.0.111.1014.14j2.16.0....0...1c.1.34.serp..17.3.153.MLs9RlWkn50', 'google oauth how to know user is logged out - Google 搜尋', '', '', '', '', '', '2014-02-09 12:21:39'),
(71, 0, 0, '', '7,9', '//cdn.sstatic.net/stackoverflow/img/favicon.ico', 'http://stackoverflow.com/questions/6673867/google-oauth-sign-in-using-your-google-account', 'Google oauth Sign in using your Google account', '', '', '', '', '', '2014-02-09 12:22:50'),
(72, 0, 0, '', '3,4', '//cdn.sstatic.net/stackoverflow/img/favicon.ico', 'http://stackoverflow.com/questions/6673867/google-oauth-sign-in-using-your-google-account', 'Google oauth Sign in using your Google account', '', '', '', '', '', '2014-02-09 12:24:31'),
(73, 0, 0, '', '5,10', 'http://book.cakephp.org/2.0/en/core-libraries/components/../../_static/favicon.ico', 'http://book.cakephp.org/2.0/en/core-libraries/components/authentication.html', 'Authentication — CakePHP Cookbook 2.x documentation', '', '', '', '', '', '2014-02-09 12:25:25'),
(74, 0, 0, '', '7,9', '//cdn.sstatic.net/stackoverflow/img/favicon.ico', 'http://stackoverflow.com/questions/6673867/google-oauth-sign-in-using-your-google-account', 'Google oauth Sign in using your Google account', '', '', '', '', '', '2014-02-09 12:26:24'),
(119, 1, 0, 'joe.chen.1', '7,12', 'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png', 'https://docs.google.com/spreadsheet/ccc?key=0AjJy4AXy73o_dC0ybWtSMFZxdTdVTEdMUHgweUNVVXc&usp=drive_web#gid=0', 'UI team player- to-do and issues list', '', '', '', '', '', '2014-02-12 02:20:06'),
(140, 1, 0, 'joe.chen.1', '2,12', 'https://www.google.com.tw/favicon.ico', 'https://www.google.com.tw/search?q=gmail+api&oq=gmail+api&aqs=chrome..69i57j0l5.1578j0j7&sourceid=chrome&espv=210&es_sm=122&ie=UTF-8', 'gmail api - Google 搜尋', '', '', '', '', '', '2014-02-12 03:38:40'),
(136, 1, 0, 'joe.chen.1', '7,8', 'http://translate.google.com.tw/favicon.ico', 'http://translate.google.com.tw/#en/zh-TW/bead', 'Google 翻譯', '', '', '', '', '', '2014-02-12 03:14:47'),
(137, 1, 0, 'joe.chen.1', '4,0', '//d1y9yo7q4hy8a7.cloudfront.net/static/00033/core/20140127_1390790332/img/favicon_v2.png', 'http://9gag.com/gag/aOq9eLN', '9GAG - My first thought when I heard that NASA is accepting applications from companies to mine the moon.', '', '', '', '', '', '2014-02-12 03:19:34'),
(138, 1, 0, 'joe.chen.1', '7,7', 'http://preev.com/favicon.ico', 'http://preev.com/', 'Bitcoin Exchange Rate — Bitcoin Live Converter — Preev', '', '', '', '', '', '2014-02-12 03:20:51'),
(160, 1, 0, 'joe.chen.1', '3,40', 'http://tw.img.nextmedia.com/appledaily/pinsite/64x64.ico', 'http://www.appledaily.com.tw/appledaily/article/headline/20140215/35642629/', '我的陳文茜：這個國家太對不起年輕人（陳文茜） | 蘋果日報', '', '', '', '', '', '2014-02-16 12:05:12'),
(141, 1, 0, 'joe.chen.1', '3,2', 'http://developers.google.com/_static/fe5fd70bed/images/favicon.ico', 'https://developers.google.com/gmail/actions/reference/index', 'Reference Guide - Actions in the Inbox — Google Developers', '', '', '', '', '', '2014-02-12 05:26:41'),
(142, 1, 0, 'joe.chen.1', '7,10', 'http://developers.google.com/_static/fe5fd70bed/images/favicon.ico', 'https://developers.google.com/gmail/actions/', 'Actions in the Inbox — Google Developers', '', '', '', '', '', '2014-02-12 07:34:19'),
(148, 1, 0, 'joe.chen.1', '6,14', 'http://l.yimg.com/os/mit/media/p/presentation/images/icons/default-apple-touch-icon-1636137.png', 'http://tw.news.yahoo.com/video/cute-slow-loris-enjoys-rice-050000995.html', '懶猴家教好 拿叉子吃飯 | 觀賞影片- 新聞 台灣', '', '', '', '', '', '2014-02-13 11:21:00'),
(154, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 07:46:35'),
(155, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 07:50:23'),
(159, 1, 0, 'joe.chen.1', '1,33', 'http://www.upworthy.com/favicon.ico', 'http://www.upworthy.com/', 'Upworthy: Things that matter. Pass ''em on.', '', '', '', '', '', '2014-02-16 12:03:41'),
(150, 1, 0, 'joe.chen.1', '1,18', 'http://www.dearjohn.idv.tw/favicon.ico', 'http://www.dearjohn.idv.tw/1325', '  從外國人的角度看金庸小說？ | 遨遊天地任我行', '', '', '', '', '', '2014-02-14 14:23:00'),
(151, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 07:45:01'),
(152, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 07:45:09'),
(153, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 07:45:39'),
(145, 1, 0, 'joe.chen.1', '1,11', 'http://l.yimg.com/os/mit/media/p/presentation/images/icons/default-apple-touch-icon-1636137.png', 'http://tw.news.yahoo.com/%E5%AE%8B%E8%8A%B8%E6%A8%BA%E6%8E%A5%E6%9B%BF%E9%99%B3%E5%A6%8D%E5%B8%8C-%E6%88%90%E6%96%B0%E9%A6%AC%E5%B0%BE%E5%A6%B9%E5%A5%B3%E7%A5%9E-183800671.html', '宋芸樺接替陳妍希 成新馬尾妹女神 - Yahoo奇摩新聞', '', '', '', '', '', '2014-02-12 16:08:34'),
(146, 1, 0, 'joe.chen.1', '5,25', 'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png', 'https://docs.google.com/spreadsheet/ccc?key=0AjJy4AXy73o_dGYzLUdlQWhma09mYnN0LVo5MjZSRXc&usp=drive_web#gid=0', 'O&CO改版規劃及報價', '', '', '', '', '', '2014-02-12 16:29:38'),
(147, 1, 0, 'joe.chen.1', '5,21', 'http://www.denextcreative.com/cPanel_magic_revision_1343942280/unprotected/cpanel/favicon.ico', 'http://www.denextcreative.com:2082/frontend/x3/index.html', 'cPanel Login', '', '', '', '', '', '2014-02-12 16:33:21'),
(156, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 08:58:10'),
(157, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 08:58:13'),
(158, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-16 08:58:14'),
(161, 1, 0, 'joe.chen.1', '1,27', 'http://tw.img.nextmedia.com/appledaily/pinsite/64x64.ico', 'http://www.appledaily.com.tw/appledaily/article/headline/20140215/35642629/', '我的陳文茜：這個國家太對不起年輕人（陳文茜） | 蘋果日報', '', '', '', '', '', '2014-02-16 12:08:27'),
(162, 1, 0, 'joe.chen.1', '7,28', 'https://www.google.com.tw/favicon.ico', 'https://www.google.com.tw/search?espv=210&es_sm=122&q=jquery+focus+scroll+top&oq=jquery+focus+scroll+top&gs_l=serp.3..0i30.17909.30799.0.31110.25.22.1.2.2.0.108.1197.21j1.22.0....0...1c.1.35.serp..0.25.1207.P85VnJHL8J0', 'jquery focus scroll top - Google 搜尋', '', '', '', '', '', '2014-02-20 14:04:20'),
(163, 1, 0, 'joe.chen.1', '5,32', 'http://l.yimg.com/os/mit/media/p/presentation/images/icons/default-apple-touch-icon-1636137.png', 'http://tw.news.yahoo.com/%E5%9F%BA%E7%89%B9%E5%AD%A3%E5%BE%8C%E9%80%80%E4%BC%91-%E5%AA%92%E9%AB%94%E6%93%A0%E7%88%86%E8%A8%98%E8%80%85%E6%9C%83-060051235.html', '基特季後退休 媒體擠爆記者會 - Yahoo奇摩新聞', '', '', '', '', '', '2014-02-20 14:19:15'),
(164, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-20 15:28:29'),
(165, 0, 0, '', ',', '', '', '', '', '', '', '', '', '2014-02-20 15:28:31');

-- --------------------------------------------------------

--
-- 資料表格式： `link_meta`
--

CREATE TABLE IF NOT EXISTS `link_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `urls` text NOT NULL,
  `meta` text NOT NULL,
  `typed_data` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 列出以下資料庫的數據： `link_meta`
--


-- --------------------------------------------------------

--
-- 資料表格式： `link_pages`
--

CREATE TABLE IF NOT EXISTS `link_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `thumb` varchar(255) NOT NULL,
  `desc` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 列出以下資料庫的數據： `link_pages`
--


-- --------------------------------------------------------

--
-- 資料表格式： `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username_id` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `obj_auth` text NOT NULL,
  `obj_me` text NOT NULL,
  `obj_drive_about` text NOT NULL,
  `google_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 列出以下資料庫的數據： `users`
--

INSERT INTO `users` (`id`, `username_id`, `display_name`, `image`, `obj_auth`, `obj_me`, `obj_drive_about`, `google_id`) VALUES
(1, 'joe.chen.1', 'joe chen', 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50', '', '', '', '104367538726866759911');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
