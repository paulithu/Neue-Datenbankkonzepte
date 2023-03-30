function checkAccess(req, res, next, jsonApis) {
  let url = req.url;
  // URL wird verschönert
  url = url.replace('/api/', ''); 
  url = url.split('/')[0];
  url = url.split('?')[0];
  
// Fehlermeldung bei falscher URL 
  if (jsonApis.includes(url)) next();
  else {
    res.statusCode = 404; 
    return res.send({ message: 'api wurde nicht gefunden' });
  }
}

module.exports = checkAccess;
