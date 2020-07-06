<?php

define("URL_FLOWERS", 'http://www.flower-tei.com');

spl_autoload_register(function ($name) {
    require('class/' . $name . '.php');
});

include('simple_html_dom.php');   //подключаем файл с классом SimpleHTMLDOM

$html = new simple_html_dom();    //создаем объект
$name = new simple_html_dom();
$html->load_file(URL_FLOWERS);


$html->load($html->find('#main', 0)->innertext);
$tables = $html->find('table');

$flowers = array();

foreach ($tables as $table) {
    $tr = $table->find('tr');

    $td0 = $tr[0]->find('td');
    $td1 = $tr[1]->find('td');

    if (count($td0) == count($td1)) {
        for ($i = 0; $i < count($td0); $i++) {
            $flower = new Flower();
            $flower->link = $td0[$i]->find('a', 0)->href;
            $flower->linkImg = $td0[$i]->find('img', 0)->src;
            $flower->price = $td1[$i]->innertext;
            $name->load_file(URL_FLOWERS . $flower->link);
            $flower->name = $name->find('title', 0)->innertext;
            $name->clear();
            array_push($flowers, $flower);
        }
    }
}


if (isset($argc)) {
    $file = fopen('flowers.txt', 'w+');

    foreach ($flowers as $flower) {
        $flowerOutput = $flower->name . ';' .
            $flower->price . ';' .
            URL_FLOWERS . $flower->linkImg . "\n\r";
        fwrite($file, $flowerOutput);
    }

    fclose($file);
    echo "Выгружено записей:" . count($flowers) . "\n";
} else {
    echo '<style>';
    echo 'th{font-size:1.5em;}';
    echo 'tr:nth-child(even){background-color:#eee;}';
    echo 'td{text-align:center;padding:5px;border:1px dotted #555;}';
    echo '</style>';

    echo '<table><tr>';
    echo '<th>Наименование</th>';
    echo '<th>Цена</th>';
    echo '<th>Ссылка на товар</th>';
    echo '<th>Ссылка на картинку</th>';
    echo '<th>Картинка</th></tr>';

    array_map(function ($flower) {
        echo '<tr><td>' . $flower->name . '</td>';
        echo '<td>' . $flower->price . '</td>';
        echo '<td><a href="' . URL_FLOWERS . $flower->link . '">'
            . URL_FLOWERS . $flower->link . '</a></td>';
        echo '<td>' . URL_FLOWERS . $flower->linkImg . '</td>';
        echo '<td><img alt="' . $flower->name . '" src="' . URL_FLOWERS . $flower->linkImg . '"></td></tr>';
    }, $flowers);

    echo '</table>';
}