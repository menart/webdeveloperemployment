# Меню
## Задание
Нарисуйте в свободной форме схему БД, для хранения информации о меню приложения. Укажите наименования таблиц, полей и связей:

- меню состоит из отдельных пунктов и подпунктов;
- названия пунктов и подпунктов уникальны;
- существуют различные пользователи;
- отдельные пользователи могут не иметь доступ к некоторым пунктам и подпунктам.

## Реализация

Есть таблица tMenu
У нее зависимости
1. ParentId = 0 Выводиться root дерево
2. Подпункты в parentId зависят от menuId родителя

-- 1. id=1 parentId=0 root
       |  
-- 2.  -- id=2 parentId=1 подпункт root

Есть таблица tUser и tAccess
tMenu - отношение многие ко многим через tAccess - tUser
Если в tAccess есть связка tUser и tMenu, значит пользователь имеет доступ к этому подпункту

## Использование

Создан view viewMenu

`
SELECT * FROM dbMenu.viewMenu
where menuParentId=0 and userId=2;`

Вывести root для пользователя под Id =2

`
SELECT * FROM dbMenu.viewMenu
where menuParentId=0 and userName like 'Admin'';`

Вывести root для пользователя под login Admin

Зависимости в pdf файле
Создание таблиц в sql файле

**Затраченое время 1 час**