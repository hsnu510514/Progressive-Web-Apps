var dbPromise = idb.open('post-store', 1, function(db) {
  if (!db.objectStoreNames.contains('posts')) {
    db.createObjectStore('posts', {keypath: 'id'});
  }
})

function writeData(st, data) {
  return dbPromise
    .then(function(db) {
      var tx = db.transaction(st, 'readwrite');
      var store = tx.objectStore('posts');
      store.put(data);
      return tx.complete;
    })
}