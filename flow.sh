for i in $(find lib -type f -name "*.d.ts");
  do sh -c "flowgen $i -o ${i%.*.*}.js.flow";
done;
