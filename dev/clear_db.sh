if [ -z "$1" ]; then
  echo "Usage: clear_db.sh <option>"
  echo "Options: 'all' or 'module_name'"
  exit 1
fi

MODULE="$1"

BASE_DIR="modules"

for module in "$BASE_DIR"/*; do

  FILES_DIR="$module/DB/files"
  INDEX_DIR="$FILES_DIR/index"

  if [[ -d "$FILES_DIR" && ( "../modules/$1" == "$module" || "$1" == "all" ) ]] ; then

    echo "$module"
    echo "Cleaning DB............."

    rm -rf "$FILES_DIR/"*

    echo "Creating new DB........."
    echo "[]" > "$FILES_DIR/db.json"

    echo "Creating new Index......"
    mkdir -p "$INDEX_DIR"

    echo "Creating index.json....."
    echo "[]" > "$INDEX_DIR/index.json"

    echo "-------------DB Cleaned!"
  fi
done

echo "Finished!"