update_docs:
	#npx rimraf ./dist/
	npx tsc --p tsconfig.docs.json

update_version:
	./frup.sh $v