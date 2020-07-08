CREATE DATABASE `dbMenu` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `tMenu` (
  `menuId` int unsigned NOT NULL AUTO_INCREMENT,
  `menuParentId` int unsigned NOT NULL DEFAULT '0',
  `menuName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menuId`),
  UNIQUE KEY `menuId_UNIQUE` (`menuId`),
  UNIQUE KEY `menuName_UNIQUE` (`menuName`),
  KEY `parent_key_idx` (`menuParentId`)
) ENGINE=InnoDB AUTO_INCREMENT= DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER $$
USE `dbMenu`$$
CREATE DEFINER=`root`@`%` TRIGGER `tMenu_BEFORE_INSERT` BEFORE INSERT ON `tMenu` FOR EACH ROW BEGIN
 if new.menuParentId not in (select menuId from tMenu) then
	set @msg := concat('ErrorInsert: not parent menuId: ', cast(new.menuParentId as char));
    signal sqlstate '45000' set message_text = @msg;
 end if; 
END$$
DELIMITER ;

DELIMITER $$
USE `dbMenu`$$
CREATE DEFINER=`root`@`%` TRIGGER `tMenu_BEFORE_UPDATE` BEFORE UPDATE ON `tMenu` FOR EACH ROW BEGIN
 if new.menuParentId not in (select menuId from tMenu) then
	set @msg := concat('ErrorUpdate: not parent menuId: ', cast(new.menuParentId as char));
    signal sqlstate '45000' set message_text = @msg ; 
 end if; 
END$$
DELIMITER ;

CREATE TABLE `tUser` (
  `userId` int unsigned NOT NULL AUTO_INCREMENT,
  `userName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userId_UNIQUE` (`userId`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `tAccess` (
  `accessId` int unsigned NOT NULL AUTO_INCREMENT,
  `menuId` int unsigned NOT NULL,
  `userId` int unsigned NOT NULL,
  PRIMARY KEY (`accessId`),
  KEY `key_menuId_idx` (`menuId`),
  KEY `keu_userId_idx` (`userId`),
  CONSTRAINT `keu_userId` FOREIGN KEY (`userId`) REFERENCES `tUser` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `key_menuId` FOREIGN KEY (`menuId`) REFERENCES `tMenu` (`menuId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`%` 
    SQL SECURITY DEFINER
VIEW `viewMenu` AS
    SELECT 
        `tMenu`.`menuId` AS `menuId`,
        `tMenu`.`menuParentId` AS `menuParentId`,
        `tMenu`.`menuName` AS `menuName`,
        COUNT(`t`.`menuId`) AS `childcount`,
        `tUser`.`userId` AS `userId`,
        `tUser`.`userName` AS `userName`
    FROM
        ((`tMenu`
        LEFT JOIN `tMenu` `t` ON ((`t`.`menuParentId` = `tMenu`.`menuId`)))
        LEFT JOIN `tUser` ON (`tUser`.`userId` IN (SELECT 
                `tAccess`.`userId`
            FROM
                `tAccess`
            WHERE
                (`tAccess`.`menuId` = `tMenu`.`menuId`))))
    GROUP BY `tMenu`.`menuId` , `tMenu`.`menuParentId` , `tMenu`.`menuName` , `tUser`.`userId` , `tUser`.`userName`