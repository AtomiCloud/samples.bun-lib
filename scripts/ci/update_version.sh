#!/usr/bin/env bash

version="$1"
package_path="$2"
set -eou pipefail

[ "$package_path" = '' ] && package_path="./package.json"

jq --arg new_version "${version}" '.version = $new_version' "${package_path}" >tmp
mv tmp "${package_path}"
