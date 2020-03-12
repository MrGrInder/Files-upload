<?php

function jsonResponse($code = 200, $data = null)
{
    header_remove();
    http_response_code($code);

    $arrStatus = [
      200 => '200 OK',
      400 => '400 Bad Request',
      422 => 'Unprocessable Entity',
      500 => '500 Internal Server Error',
    ];
    $status = $arrStatus[$code];

    header('Cache-Control: no-transform,public,max-age=300,s-maxage=900');
    header('Content-Type: application/json');
    header('Status: {$status}');

    return json_encode(['status' => $code < 300, 'data' => $data]);
}

$uploadDir = 'uploads/files/';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  if ($handle = opendir($uploadDir)) {
    $filesList = [];
    $cnt = 0;
    while (false !== ($entry = readdir($handle))) {
      if ($entry != "." && $entry != "..") {
        $filesList[$cnt]['fileName'] = mb_substr($entry, 7);
        $filesList[$cnt]['fileType'] = mime_content_type($uploadDir.$entry);
        $filesList[$cnt]['fileInfo']['newFileLink'] = $entry;
        $filesList[$cnt]['fileInfo']['newFileHash'] = mb_substr($entry, 0, 6);
        $cnt++;
      }
    }

    echo jsonResponse(200, ['filesList' => $filesList]);

    closedir($handle);
  } else {
    echo jsonResponse(500, ['message' => 'Ошибка!', 'fullText' => 'Невозможно открыть директорию с файлами']);
  }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if ($_POST) {
    $newArray = json_decode($_POST['data'], true);

    if (!isset($newArray['needDelete']) || !$newArray['needDelete']) {
      echo jsonResponse(400, ['message' => 'Ошибка!', 'fullText' => 'Ложный запрос']);
    }
    
    if (unlink($uploadDir . $newArray['fileName'])) {
      echo jsonResponse(200, ['message' => 'Файл успешно удален!']);
    } else {
      echo jsonResponse(500, ['message' => 'Ошибка!', 'fullText' => 'Такого файла не существует']);
    }
  }

  if ($_FILES['filesUpload']['error'] == UPLOAD_ERR_OK) {
    $tmpName = $_FILES['filesUpload']['tmp_name'];
    $fileHash = substr(md5(time()), 0, 6);
    $resultName = $uploadDir . $fileHash .'_'. basename($_FILES['filesUpload']['name']);
    
    if (move_uploaded_file($tmpName, $resultName)) {
      echo jsonResponse(200, ['message' => 'Файл успешно загружен!', 'newFileLink' => $resultName, 'newFileHash' => $fileHash]);
    } else {
      echo jsonResponse(500, ['message' => 'Что-то пошло не так...', 'fullText' => $_FILES['filesUpload']['error']]);
    }
  } else {
    echo jsonResponse(400, ['message' => 'Ошибка!', 'fullText' => $_FILES['filesUpload']['error']]);
  }
}

?>
