Als erstes muss der folgenden Befehl im Terminal ausgeführt werden.

" npm install "

Danach Befehl:

" node server.js"

Kontrolle: Der Server startet auf Port:3001

Danach wurde muss der Docker Image gebaut werden, diese wird mit folgenden gemacht:

" docker build -t file-sharing . "

Danach kann die Applikation mit dem Befehl:

" docker-compose up "

Danach ist die Anwendung auf dem localhost:3001 zu finden.

Die Anwednung ist ganz ituitive:

Hochladen (max. 5 Datein auf einmal) -> Danach Seite neuladen und alle Dateien werden angezeigt.

Download und löschen der Dateien über die Button.