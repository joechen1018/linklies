-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 建立日期: Feb 06, 2014, 07:50 PM
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
  `timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 列出以下資料庫的數據： `folders`
--


-- --------------------------------------------------------

--
-- 資料表格式： `folder_types`
--

CREATE TABLE IF NOT EXISTS `folder_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 列出以下資料庫的數據： `folder_types`
--


-- --------------------------------------------------------

--
-- 資料表格式： `links`
--

CREATE TABLE IF NOT EXISTS `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=68 ;

--
-- 列出以下資料庫的數據： `links`
--

INSERT INTO `links` (`id`, `user_id`, `grid`, `ico`, `url`, `title`, `thumb`, `site`, `desc`, `html_source`, `hash`, `timestamp`) VALUES
(13, 0, '7,12', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/gadgets/docs/remote-content', 'Working with Remote Content - Gadgets API — Google Developers', '', '', '', '', '', '2014-02-01 11:46:27'),
(14, 0, '5,14', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=rp9sYmnoFEU&list=RDeWnHL-M8g3g', 'Nina Nesbitt - Little Lion Man (David Keller Remix)', '', '', '', '', '', '2014-02-01 11:46:37'),
(64, 0, '4,9', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://jobs.inside.com.tw/jobs/page/6', 'Inside Job Board - 網路業工作職缺看板', '', '', '', '', '', '2014-02-02 18:21:23'),
(62, 0, '2,7', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://jobs.inside.com.tw/jobs/2912-%E7%9F%A5%E5%90%8D%E5%A4%96%E5%95%86%E8%BB%9F%E9%AB%94%E5%85%AC%E5%8F%B8-%E8%AA%A0%E5%BE%B5-ios-manager-%E7%9F%A5%E5%90%8D%E5%A4%96%E5%95%86%E8%BB%9F%E9%AB%94%E5%85%AC%E5%8F%B8', '知名外商軟體公司 誠徵 iOS Manager - 知名外商軟體公司', '', '', '', '', '', '2014-02-02 14:06:25'),
(17, 0, '1,8', 'http://cache.ettoday.net/lemon/images/favicon.ico', 'http://www.ettoday.net/dalemon/post/2136?from=fb_et_pets', '我雄赳赳的哈士奇美容後怎麼變這樣！', '', '', '', '', '', '2014-02-01 13:27:14'),
(9, 0, '5,4', 'http://underscorejs.org/favicon.ico', 'http://underscorejs.org/', 'Underscore.js', '', '', '', '', '', '2014-02-01 10:30:11'),
(10, 0, '1,6', 'http://pansci.tw/wp-content/themes/Broadcast/favicon.ico', 'http://pansci.tw/archives/56103', '春節恐慌症：為什麼老愛問我畢業、工作、有對象了沒？ | PanSci 泛科學', '', '', '', '', '', '2014-02-01 10:30:51'),
(12, 0, '5,2', 'http://github.com/favicon.ico', 'https://github.com/allmarkedup/purl', 'allmarkedup/purl', '', '', '', '', '', '2014-02-01 10:33:46'),
(18, 0, '5,0', 'http://www.wolframalpha.com/favicon_calculate.png', 'http://www.wolframalpha.com/', 'Wolfram|Alpha: Computational Knowledge Engine', '', '', '', '', '', '2014-02-01 13:36:55'),
(24, 0, '4,1', 'http://localhost/phpmyadmin/./favicon.ico', 'http://localhost/phpmyadmin/index.php?db=linklies&token=344573e08505ac18dac9b0e313b1e8ed', 'phpMyAdmin 3.2.4 -\n    localhost', '', '', '', '', '', '2014-02-01 16:37:19'),
(25, 0, '5,5', 'http://taipei.kijiji.com.tw/favicon.ico', 'http://taipei.kijiji.com.tw/c-Goods-home-appliances-TV-CHIMEI-37-W0QQAdIdZ563079706', '嶔縊中古二手家電 CHIMEI 奇美 37吋 液晶電視 台北地區免運費 (實體店面)', '', '', '', '', '', '2014-02-01 16:37:33'),
(27, 0, '6,11', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/accounts/docs/OAuth2?hl=zh-TW', 'Using OAuth 2.0 to Access Google APIs - Google Accounts Authentication and Authorization — Google Developers', '', '', '', '', '', '2014-02-01 16:38:00'),
(30, 0, '6,6', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://www.inside.com.tw/2014/02/01/10-month-old-startup-buys-93-year-old-business-for-100-million', '未滿一歲的新創公司，用 1 億美金買下百年企業', '', '', '', '', '', '2014-02-01 16:40:32'),
(31, 0, '3,20', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-01 16:43:36'),
(32, 0, '5,10', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-01 16:43:46'),
(33, 0, '6,13', 'http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png', 'http://www.youtube.com/watch?v=eWnHL-M8g3g&list=RDeWnHL-M8g3g', 'Marek Hemmann - Inessa', '', '', '', '', '', '2014-02-01 16:43:53'),
(36, 0, '7,4', 'http://taipei.kijiji.com.tw/favicon.ico', 'http://taipei.kijiji.com.tw/c-Goods-home-appliances-TV-CHIMEI-37-W0QQAdIdZ563079706', '嶔縊中古二手家電 CHIMEI 奇美 37吋 液晶電視 台北地區免運費 (實體店面)', '', '', '', '', '', '2014-02-01 16:45:19'),
(37, 0, '4,3', '//d1nmj8esheg8s6.cloudfront.net/build/1390807413/img/favicon.ico', 'http://9gag.tv/v/163', 'Brilliant Way To Get Women To Exercise: Male Stripping | 9gag.tv', '', '', '', '', '', '2014-02-01 16:45:20'),
(63, 0, '3,8', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://jobs.inside.com.tw/jobs/page/6', 'Inside Job Board - 網路業工作職缺看板', '', '', '', '', '', '2014-02-02 17:28:04'),
(41, 0, '0,4', 'http://developers.google.com/_static/dd36832bd6/images/favicon.ico', 'https://developers.google.com/accounts/docs/OAuth2?hl=zh-TW', 'Using OAuth 2.0 to Access Google APIs - Google Accounts Authentication and Authorization — Google Developers', '', '', '', '', '', '2014-02-01 16:47:00'),
(42, 0, '0,9', 'http://cache.ettoday.net/web_2011/images/favicon_desktop.ico', 'http://www.ettoday.net/news/20140110/314884.htm', '熱戀郭書瑤！大學生金陽不怕女友比較紅：她是我的女神', '', '', '', '', '', '2014-02-01 16:51:00'),
(43, 0, '1,10', 'http://taipei.kijiji.com.tw/favicon.ico', 'http://taipei.kijiji.com.tw/c-Goods-home-appliances-other-electric-equipment-TH-1215-200-W0QQAdIdZ563346100', '~已安裝未用 全新莊頭北TH-1215 屋外型熱水器廉讓~ 原廠五年保固-第二至五年,零件免費,工本費200元', '', '', '', '', '', '2014-02-01 16:53:29'),
(44, 0, '8,5', '//www.wolframcdn.com/images/alpha.fav.png', 'http://www.wolframalpha.com/input/?i=http%3A%2F%2Fjsfiddle.net%2F', ' http://jsfiddle.net/ - Wolfram|Alpha', '', '', '', '', '', '2014-02-01 16:57:24'),
(45, 0, '5,7', '//d1y9yo7q4hy8a7.cloudfront.net/static/00028/core/20140127_1390790346/img/favicon_v2.png', 'http://9gag.com/gag/ay5WnVp', 'Son, your new tutor is here!', '', '', '', '', '', '2014-02-01 16:58:57'),
(47, 0, '5,8', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://jobs.inside.com.tw/jobs/2961-%E7%B4%84%E8%81%98php%E7%B6%B2%E9%A0%81%E5%B7%A5%E7%A8%8B%E5%B8%AB-o2odate-llc', '約聘php網頁工程師 - O2ODATE LLC', '', '', '', '', '', '2014-02-01 17:02:09'),
(50, 0, '4,11', 'http://blog.roodo.com/favicon.ico', 'http://blog.roodo.com/hhung/archives/26894880.html', '力爭下游的大叔詩人──讀許赫《原來女孩不想嫁給阿北》@鴻鴻的過氣兒童樂園', '', '', '', '', '', '2014-02-01 17:30:37'),
(66, 0, '6,1', 'http://lesscss.org/assets/favicon.ico', 'http://lesscss.org/', '\n  Getting started | Less.js\n', '', '', '', '', '', '2014-02-04 13:41:06'),
(67, 0, '6,3', 'http://cdn.inside.com.tw/wp-content/themes/magnovus/favicon.ico', 'http://share.inside.com.tw/posts/3840?ref=sidebar', 'Google 釋出 Chromecast SDK - Inside 網摘', '', '', '', '', '', '2014-02-04 13:43:21');

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
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 列出以下資料庫的數據： `users`
--


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
