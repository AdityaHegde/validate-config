define(function() {

return {
  replacePlaceholders : function(hierarchy, hierarchyPlaceholder) {
    var retHierarchy = hierarchyPlaceholder.slice();
    for(var i = 0, j = 0; i < hierarchy.length && j < this.hierarchyPlaceholders.length; i++) {
      if(i === this.hierarchyPlaceholders[j].index) {
        if(retHierarchy[i] === this.hierarchyPlaceholders[j].placeholder) {
          retHierarchy[i] = hierarchy[i];
          j++;
        }
        else {
          break;
        }
      }
      else if(hierarchy[i] !== retHierarchy[i]) {
        break;
      }
    }
    return retHierarchy;
  },

  pushToHierarchy : function(key, keyPlaceholder) {
    this.hierarchyStr = this.hierarchy.join(".");
    this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");

    if(key !== keyPlaceholder) {
      this.hierarchyPlaceholders.push({
        placeholder : keyPlaceholder,
        index       : this.hierarchyPlaceholder.length,
      });
    }

    this.hierarchy.push(key);
    this.hierarchyPlaceholder.push(keyPlaceholder);

    this.fullHierarchyStr = this.hierarchy.join(".");
    this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
  },

  popFromHierarchy : function() {
    if(this.hierarchyPlaceholders.length > 0 && 
       this.hierarchyPlaceholders[this.hierarchyPlaceholders.length - 1].index === this.hierarchyPlaceholder.length - 1) {
      this.hierarchyPlaceholders.pop();
    }

    this.hierarchy.pop();
    this.hierarchyPlaceholder.pop();

    this.hierarchyStr = this.hierarchy.slice(0, -1).join(".");
    this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.slice(0, -1).join(".");

    this.fullHierarchyStr = this.hierarchy.join(".");
    this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
  },
};

});
