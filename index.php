<!doctype html>
<html lang="ru">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <!-- Font Awesome CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

    <link rel="stylesheet" href="site.css">

    <title>Simple files upload</title>
  </head>
  <body>
    <div class="container">
      <div class="py-5 text-center">
        <h2>Здесь вы можете загрузить файлы</h2>
      </div>

      <div class="col-sm-12 col-lg-6 mr-auto ml-auto border p-4">
        <form class="simple-files-upload" method="post" enctype="multipart/form-data">
          <div class="form-group">
            <label><strong>Загрузить файлы</strong></label>
            <div class="custom-file">
              <input type="file" name="files[]" multiple class="custom-file-input files-upload" id="simple-file">
              <label class="custom-file-label" for="simple-file">Выберите файлы</label>
            </div>
          </div>
          <div class="form-group border rounded hp-150 cur-p container-dragndrop"></div>
          <div class="form-group">
            <button type="button" class="btn btn-block btn-dark btn-files-upload"><i class="fa fa-fw fa-upload"></i>Закачать</button>
          </div>
        </form>
      </div>

      <div class="col-sm-12 col-lg-6 mt-3 mr-auto ml-auto border p-4 simple-files-preview">
      </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.js" integrity="sha256-BTlTdQO9/fascB1drekrDVkaKd9PkwBymMlHOiG+qLI=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script type="text/javascript" crs="https://cdn.jsdelivr.net/npm/bs-custom-file-input/dist/bs-custom-file-input.min.js"></script>
    <script type="text/javascript" src="file.js"></script>
  </body>
</html>