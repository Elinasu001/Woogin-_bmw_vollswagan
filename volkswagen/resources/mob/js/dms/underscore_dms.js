//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {
  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) {
		return func;
	}
    switch (argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-parameter case has been omitted only because no current consumers
      // made use of it.
      case null:
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
  // This accumulates the arguments passed into an array, after a given index.
  var restArgs = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
	//console.log('start_func.length:',func,func.length,startIndex);
    return function() {
		//console.log('restArgs_arguments:',arguments);
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
	  //console.log('restArgs_length:',length);
	  //console.log('restArgs_rest:',rest);
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
		//console.log('restArgs_rest[index]:',rest[index]);
      }
	  //console.log('restArgs_startIndex:',startIndex);
	  //console.log('restArgs_this:',this);
	  //console.log('restArgs_rest:',rest);
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
		//console.log('restArgs_args[index]:',args[index]);
      }
      args[startIndex] = rest;
	  //console.log('restArgs_this2:',this);
	  //console.log('restArgs_args2:',args);
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
	  ////console.log('isArrayLike_collection:', collection);
    var length = getLength(collection);
	////console.log('isArrayLike_length:', length);
	////console.log('isArrayLike_typeof length:', typeof  length);
	////console.log('isArrayLike_length >= 0:', length >= 0);
	////console.log('isArrayLike_length <= MAX_ARRAY_INDEX:', length <= MAX_ARRAY_INDEX);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
//console.log'map시작');
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
//console.log'isArrayLike(obj):', isArrayLike(obj));
//console.log'map_keys(obj):', _.keys(obj));
//console.log'map_keys:', keys);
//console.log'map_length:', length);
//console.log'map_results:', results);
//console.log'map_iteratee:', iteratee);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
	 //console.log'map_currentKey:',obj[currentKey], currentKey, obj);
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
   //console.log'map:',results);
//console.log'map_keys:',keys);
//console.log'map_obj:',obj);
//console.log'map_iteratee:',iteratee);
//console.log'map_context:',context);
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
		//console.log('reducer:',arguments);
		//console.log('reducer_obj:',obj);
		//console.log('reducer_iteratee:',iteratee);
		//console.log('reducer_memo:',memo);
		//console.log('reducer_initial:',initial);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
		  //console.log('index:',index);
		  //console.log('reducer keys:',keys);
		  //console.log('reducer_index_bf:',index);
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
	  //console.log('reducer_index_af:',index);
	  //console.log('reducer_memo_af:',memo);
      for (; index >= 0 && index < length; index += dir) {
		  //console.log('for reducer_index:',index);
        var currentKey = keys ? keys[index] : index;
		//console.log('for reducer_memo:',memo);
		//console.log('for reducer_currentKey:',currentKey);
		//console.log('for reducer_obj[currentKey]:',obj[currentKey]);
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
		//console.log('reducer_memo_af111:',memo);
      }
	  //console.log('memo:',memo);
      return memo;
    };

    return function(obj, iteratee, memo, context) {
		//console.log('createReduce:',arguments);
		//console.log('createReduce_iteratee:',iteratee);
		//console.log('createReduce_memo:',memo);
		//console.log('createReduce_context:',context);
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
	////console.log('filter:',arguments);
	////console.log('filter_predicate:',predicate);
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
		////console.log('filter each:',value, index, list);
      if (predicate(value, index, list)){
	    results.push(value)
      };
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)){
		  //console.log('every_return false');
		  return false;
	  }
    }
	//console.log('every_return true');
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	  //console.log( 'contains_obj:', obj);
	  //console.log( 'contains_item:', item);
	  //console.log( 'contains_fromIndex:', fromIndex);
	  //console.log( 'contains_guard:', guard);
	  //console.log( 'contains_isArrayLike(obj):', isArrayLike(obj));
    if (!isArrayLike(obj)){
		obj = _.values(obj);
	}
    if (typeof fromIndex != 'number' || guard){
		fromIndex = 0;
	}
	  //console.log( 'contains_fromIndex_after:', fromIndex);
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArgs(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
	////console.log('max_obj:', obj);
	////console.log('max_iteratee:', iteratee);
	////console.log('max_context:', context);
	////console.log('max_result:', result);
	////console.log('max_lastComputed:', lastComputed);
	////console.log('max_value:', value);
	////console.log('max_computed:', computed);
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
	  ////console.log('if1_obj:',obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
	  ////console.log('if2_iteratee:',iteratee);
      _.each(obj, function(v, index, list) {
		////console.log('each_v:',v);
		////console.log('each_index:',index);
		////console.log('each_list:',list);
        computed = iteratee(v, index, list);
		////console.log('each_computed:',computed);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortByDesc = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return -1;
        if (a < b || b === void 0) return  1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
	 //console.log('toArray_obj:', obj);
	  //console.log( 'toArray_isArray(obj):', _.isArray(obj));
	  //console.log( 'toArray_isString(obj):', _.isString(obj));
	  //console.log( 'toArray_isArrayLike(obj):', isArrayLike(obj));
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) {
		return void 0;
	}
    if (n == null || guard) {
		  return array[0]
	};
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
	  //console.log( 'rest_arguments:', arguments);
	  //console.log( 'rest_n:', n);
	  //console.log( 'rest_guard:', guard);
	  //console.log( 'rest_n == null || guard ? 1 : n:', n == null || guard ? 1 : n);
	  //console.log( 'rest_slice:', slice);
	  ////console.log( 'rest_slice:', slice.call(array, n == null || guard ? 1 : n));
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
	////console.log('flatten_input:',input);
	////console.log('flatten_shallow:',shallow);
	////console.log('flatten_output:',arguments);
	////console.log('flatten_strict:',strict);
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
	  ////console.log('flatten_for_Value:',value);
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
		  ////console.log('shallow_false_output:',shallow);
          idx = output.length;
		  ////console.log('shallow_false_idx:',idx);
        }
      } else if (!strict) {
        ////console.log('flatten_strict_output:',output, value);
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArgs(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	  //console.log( 'uniq_array:', array);
	  //console.log( 'uniq_isSorted:', isSorted);
	  //console.log( 'uniq_iteratee:', iteratee);
	  //console.log( 'uniq_context:', context);
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;

		  //console.log( 'uniq_iteratee_new:', iteratee);
		  //console.log( 'uniq_computed:', computed);

      if (isSorted && !iteratee) {
		  //console.log('[1]');
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
		  //console.log('[2]');
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
		  //console.log('value:', value);
        }
      } else if (!_.contains(result, value)) {
		  //console.log('[3]');
        result.push(value);
      }
    }
	//console.log('result:', result);
	//console.log('seen:', seen);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArgs(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArgs(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
	//console.log( 'unzip_array:', array);
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

	//console.log( 'unzip_length:', length);
	//console.log( 'unzip_result:', result);
    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }

	//console.log( 'unzip_result:', result);
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArgs(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
	  //console.log( 'createPredicateIndexFinder_dir:', dir);
    return function(array, predicate, context) {
		//console.log( 'createPredicateIndexFinder_return_array:', array);
		//console.log( 'createPredicateIndexFinder_return_predicate:', predicate);
		//console.log( 'createPredicateIndexFinder_return_context:', context);
      predicate = cb(predicate, context);
	  //console.log( 'createPredicateIndexFinder_return_predicate_after:', predicate);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
         //console.log( 'createIndexFinder_dir:', dir);
		//console.log( 'createIndexFinder_predicateFind:', predicateFind);
		//console.log( 'createIndexFinder_sortedIndex:', sortedIndex);
    return function(array, item, idx) {
		//console.log( 'createIndexFinder_return_array:', array);
		//console.log( 'createIndexFinder_return_item:', item);
		//console.log( 'createIndexFinder_return_idx:', idx);
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
		//console.log( 'createIndexFinder_return_i:', i);
		//console.log( 'createIndexFinder_return_length:', length);

      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
		  //console.log('??item !== item??');
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
		  //console.log( 'createIndexFinder_return_for문 실행:', array[idx], item);
        if (array[idx] === item) return idx;
      }

	  //console.log('createIndexFinder_return = -1');
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
	  //console.log( 'range_start:', start);
	  //console.log( 'range_stop:', stop);
	  //console.log( 'range_step:', step);
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

	//console.log( 'range_new_start:', start);
	//console.log( 'range_new_stop:', stop);
	//console.log( 'range_new_step:', step);

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
		//console.log('range_for_start:', start);
      range[idx] = start;
    }

	//console.log( 'range_return_range:',range);
    return range;
  };

  // Split an **array** into several arrays containing **count** or less elements
  // of initial array.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];

    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	  ////console.log('executeBound_sourceFunc:',sourceFunc);
	  ////console.log('executeBound_boundFunc:',boundFunc);
	  ////console.log('executeBound_context:',context);
	  ////console.log('executeBound_callingContext:',callingContext);
	  ////console.log('executeBound_args:',args);
    if (!(callingContext instanceof boundFunc)){
		////console.log('callingContext instanceof boundFunc?:',callingContext instanceof boundFunc);
 		return sourceFunc.apply(context, args);
	}
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArgs(function(func, context, args) {
	  ////console.log('bind_func',func);
	  ////console.log('bind_context',context);
	  ////console.log('bind_args',args);
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArgs(function(callArgs) {
       ////console.log('bound_callArgs',callArgs);
	   ////console.log('bound_func', func);
	   ////console.log('bound_bound', bound);
	   ////console.log('bound_context', context);
	   ////console.log('bound_this', this);
	   ////console.log('bound_args.concat(callArgs)', args.concat(callArgs));

      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
	////console.log('bound:',bound);
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArgs(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArgs(function(obj, keys) {
	////console.log('bindAll_obj:',obj);
	////console.log('bindAll_keys:',keys);
    keys = flatten(keys, false, false);
	////console.log('keys:',keys);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
	  ////console.log('bindAll_index[' + index + ']:',key);
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArgs(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArgs(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
	  //console.log( 'compose_arguments:', arguments);
    var args = arguments;
    var start = args.length - 1;
	//console.log( 'compose_start:', start);
    return function() {
		//console.log( 'compose_return_arguments:', arguments);
		//console.log( 'compose_return_args:', args);
		//console.log( 'compose_return_this:', this);
      var i = start;
      var result = args[start].apply(this, arguments);
	  //console.log( 'compose_return_result:', result);
      while (i--) {
		  result = args[i].call(this, result);
		  //console.log( 'compose_return_while_result:', result);
	  }
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArgs = restArgs;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
	  //console.log('keys 시작:',obj);
    if (!_.isObject(obj)) return [];

    if (nativeKeys) {
		//console.log('nativeKeys:',nativeKeys);
		//console.log('nativeKeys(obj):',nativeKeys(obj));
		return nativeKeys(obj);
	}
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
	//console.log('keys_return:', keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
	  ////console.log('createAssigner!:',obj,arguments);
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArgs(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArgs(function(obj, keys) {
	  ////console.log('omit:',obj,keys);
    var iteratee = keys[0], context;
	////console.log('omit_iteratee:',iteratee);
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
		  ////console.log('omit_iteratee2:',arguments);
        return !_.contains(keys, key);
      };
    }
	////console.log('_.pick(obj, iteratee, context):',_.pick(obj, iteratee, context));
	////console.log('_1:',obj);
	////console.log('_2:',iteratee);
	////console.log('_3:',context);
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
	////console.log('tap_obj:',obj);
	////console.log('tap_interceptor:',interceptor);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return obj != null && hasOwnProperty.call(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
	//console.log( 'random:', min, max);
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
	  ////console.log('result_path:',path,[path]);
    if (!_.isArray(path)) path = [path];
    var length = path.length;
	////console.log('result_length:',path, length,!length);
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
	   ////console.log('result_prop:',prop);
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  /****************************************************************************
  Custom Function List
  ****************************************************************************/
    _.fn_fail = function fn_fail( p_thing){
      throw new Error( p_thing);
    };

    _.fn_warn = function fn_warn( p_thing){
  	//console.log( [ "WARNING:", p_thing].join( ' '));
    };

    _.fn_note = function fn_note( p_thing){
  	//console.log( [ "NOTE:", p_thing].join( ' '));
    };

    _.fn_parseAge = function fn_parseAge( p_age) {
  	var l_rt_value;
  	if( !_.isString( p_age)){
  	  _.fn_fail( "Expecting a string");
  	}
  	_.fn_note( "Attempting to parse an age");
  	l_rt_value = parseInt( p_age, 10);
  	if( _.isNaN( l_rt_value)){
        _.fn_warn( [ "Could not parse age:", p_age].join( ' '));
        l_rt_value = 0;
  	}
  	return l_rt_value;
    };

    _.fn_naiveNth = function fn_naiveNth( p_a, p_index){
  	return p_a[ p_index];
    };

    _.fn_isIndexed = function fn_isIndexed( p_data){
  	return _.isArray( p_data) || _.isString( p_data);
    };

    _.fn_nth = function fn_nth( p_a, p_index){
  	if( !_.isNumber( p_index)){
        _.fn_fail( "Excepted a number as the index");
  	}

  	if( !_.fn_isIndexed( p_a)){
  	  _.fn_fail( "Not supported on non-indexed type");
  	}

  	if( ( p_index < 0) || ( p_index > p_a.length - 1)){
  	  _.fn_fail( "Index value is out of bounds");
  	}

  	return p_a[ p_index];
    };

    _.fn_second = function fn_second( p_a){
      return _.fn_nth(p_a, 1);
    };

    _.fn_lessOrEqual = function fn_lessOrEqual( p_x, p_y){
      return p_x <= p_y;
    };

    _.fn_comparator = function fn_comparator( p_closer_pred){
      return function ( p_x, p_y){
  	  if( p_closer_pred( p_x, p_y)){
  	    return -1;
  	  }else if( p_closer_pred( p_y, p_x)){
   	    return 1;
  	  }else{
  	    return 0;
  	  }
      }
    };

    _.fn_compareLessThanOrEqual = function fn_compareLessThanOrEqual( p_x, p_y){
      if( p_x < p_y){
  	  return -1;
      }
      if( p_x > p_y){
  	  return 1;
      }

      return 0;
    };

    _.fn_lameCSV = function fn_lameCSV( p_str){
      return _.reduce( p_str.split("\n")
  	              , function fn_lameCSV_return_reduce_in( p_table, p_row){
  	                  p_table.push( _.map( p_row.split( ",")
  					                 , function fn_lameCSV_return_reduce_in_map_in( p_c){
  	                                     ////console.log('p_c:', p_c);
  	                                     return p_c.trim();
  	                                   }
  									  )
  							    );
  	                  return p_table;
                      }
  				  , []);
    };

    _.fn_selectFirst = function fn_selectFirst( p_table){
      return _.rest( _.map( p_table, _.first));
    };

    _.fn_selectSecond = function fn_selectSecond( p_table){
      return _.rest( _.map( p_table, _.fn_second));
    };

    _.fn_selectLast = function fn_selectLast( p_table){
      return _.rest( _.map( p_table, _.last));
    };

    _.fn_existy = function fn_existy( p_x){
      return p_x !== null && p_x !== undefined;
    };

    _.fn_truthy = function fn_truthy( p_x){
      return ( p_x !== false) && _.fn_existy( p_x);
    };

    _.fn_doWhen = function fn_doWhen( p_cond, p_action){
  	//console.log( 'fn_doWhen_p_cond:', p_cond);
  	//console.log( 'fn_doWhen_p_action:', p_action);
      if( _.fn_truthy( p_cond)){
  		//console.log( 'fn_doWhen_fn_truthy');
  	  return p_action();
      }else{
  	  //console.log('not has!');
  	  return undefined;
      }
    };

    _.fn_executeIfHasField = function fn_executeIfHasField( p_closer_target, p_closer_name){
      return _.fn_doWhen( _.fn_existy( p_closer_target[ p_closer_name])
  	                  , function(){
  	                      var l_result = _.result( p_closer_target, p_closer_name);
  	                      return l_result;
                          }
  					  );
    };

    _.fn_lyricSegment = function fn_lyricSegment( p_num){
      return _.chain( [])
  	  .push( p_num + " bottles of beer on the wall")
  	  .push( p_num + " bottles of beer")
  	  .push( "Take one down, pass it around")
  	  .tap( function fn_lyricSegment_tap_in( p_lyrics){
  	    if( p_num > 1){
  		  p_lyrics.push( ( p_num - 1) + " bottles of beer on the wall.")
  	    }else{
  		  p_lyrics.push( "No more bottles of beer on the wall!")
  	    }
  	  })
  	  .value();
    };

    _.fn_song = function fn_song( p_closer_start, p_closer_end, p_closer_lyricGen){
      return _.reduce(_.range( p_closer_start, p_closer_end, -1)
  	              , function fn_song_return_reduce_in( p_acc, p_num){
  	                  return p_acc.concat( p_closer_lyricGen( p_num));
                      }
  				  , []
  				   );
    };

    _.fn_doubleAll = function fn_doubleAll( p_array){
      return _.map( p_array
  	            , function fn_doubleAll_return_map_in( p_num){
  	                return p_num * 2;
                    }
  				);
    };

    _.fn_average = function fn_average( p_array){
  	  ////console.log('fn_average:', p_array);
      var l_sum = _.reduce( p_array, function fn_average_reduce_in( p_a, p_b){
  	  return p_a + p_b;
      });

      return l_sum / _.size( p_array);
    };

    _.fn_onlyEven = function fn_onlyEven( p_array){
      return _.filter( p_array
  	               , function fn_onlyEven_filter_in( p_num){
  	                   return ( p_num % 2) === 0;
                       }
  				   );
    };

    _.fn_div = function fn_div( p_x, p_y){
      return p_x / p_y;
    };

    _.fn_isEven = function fn_isEven( p_num){
      return ( p_num % 2) === 0;
    };

    _.fn_allOf = function fn_allOf( /*funcs*/){
      return _.reduceRight( arguments
  	                    , function fn_allOf_reduceRight_in( p_truth, p_fun){
  							return p_truth && p_fun();
  						  }
  						, true
  						);
    };

    _.fn_anyOf = function fn_anyOf( /*funcs*/){
      return _.reduceRight( arguments
  	                    , function fn_anyOf_reduceRight_in( p_truth, p_fun){
  	                        return p_truth || p_fun();
                            }
  						, false
  						);
    };

    _.fn_T = function fn_T(){
      return true;
    };

    _.fn_F = function fn_F(){
      return false;
    };

    _.fn_complement = function fn_complement( p_closer_pred){
  	  //console.log( 'fn_complement_p_closer_pred:', p_closer_pred);
      return function fn_complement_return(){
  		//console.log( 'fn_complement_return_.toArray( arguments):', _.toArray( arguments));
  	  return !p_closer_pred.apply( null, _.toArray( arguments));
      };
    };

    _.fn_cat = function fn_cat(){
      var l_head = _.first(arguments),
  	    l_apply;
      //console.log('fn_cat_head:',l_head);
      if( _.fn_existy( l_head)){
  	  l_apply = l_head.concat.apply( l_head, _.rest(arguments));
  	  //console.log('fn_cat_existy_l_apply:',l_apply);
  	  return l_apply;
      }else{
  	  //console.log('fn_cat_NOT_exist');
  	  return [];
      }
    };

    _.fn_existy = function fn_existy( p_x){
      return p_x !== null && p_x !== undefined;
    };

    _.fn_construct = function fn_construct( p_head, p_tail){
      //console.log( 'fn_construct_p_head:', p_head);
  	//console.log( 'fn_construct_p_tail:', p_tail);
      return _.fn_cat( [ p_head], _.toArray( p_tail));
    };

    _.fn_mapcat = function fn_mapcat( p_fun, p_coll){
      return _.fn_cat.apply( null, _.map( p_coll, p_fun));
    };

    _.fn_butLast = function fn_butLast( p_coll){
      return _.toArray( p_coll).slice( 0, -1);
    };

    _.fn_interpose = function fn_interpose( p_inter, p_coll){
      return _.fn_butLast( _.fn_mapcat( function fn_interpose_fn_butLast_fn_mapcat_in( p_e){
  	  return _.fn_construct( p_e, [ p_inter]);
      }, p_coll))
    };

    _.fn_project = function fn_project( p_table, p_key){
      return _.map( p_table, function fn_project_return_map_in( p_obj){
  	  return _.pick.apply( null, _.fn_construct(p_obj, p_key));
      });
    };

    _.fn_rename = function fn_rename( p_obj, p_newNames){
      return _.reduce( p_newNames
  	               , function fn_rename_return_reduce_in( p_o, p_nu, p_old){
  					   ////console.log('reduce Function:', p_o, p_nu, p_old);
  					   ////console.log('reduce Function2:', construct( p_obj, _.keys( p_newNames)));
  					   ////console.log('reduce Function3:', _.omit.apply( null, construct( p_obj, _.keys( p_newNames))));
  					   if( _.has( p_obj, p_old)){
  					 	 p_o[ p_nu] = p_obj[ p_old];
  						 return p_o;
  					   }else{
  						 return p_o;
  					   }
  					 }
  				   , _.omit.apply( null, _.fn_construct( p_obj, _.keys( p_newNames)))
  				   );
    };

    _.fn_as = function fn_as( p_table, p_newNames){
  	  return _.map( p_table
  	              , function fn_as_return_map_in( p_obj){
  		              return _.fn_rename( p_obj, p_newNames);
  	                }
  				  );
    };

    _.fn_restrict = function fn_restrict( p_table, p_pred){
  	  return _.reduce( p_table
  	                 , function fn_restrict_return_reduce_in( p_newTable, p_obj){
  					     if( _.fn_truthy( p_pred( p_obj))){
  						   return p_newTable;
  						 }else{
  						   return _.without( p_newTable, p_obj);
  						 }
  	                   }
  					 , p_table
  					 );
    };

    _.fn_finder = function fn_finder( p_valueFun, p_bestFun, p_coll){
  	  ////console.log( 'fn_finder_p_valueFun:', p_valueFun);
  	  ////console.log( 'fn_finder_p_bestFun:', p_bestFun);
  	  ////console.log( 'fn_finder_p_coll:', p_coll);
  	  return _.reduce( p_coll, function fn_finder_return_reduce_in( p_best, p_current){
  		  ////console.log( 'fn_finder_reduce_p_best:', p_best);
  		  ////console.log( 'fn_finder_reduce_p_current:', p_current);
  		var l_bestValue = p_valueFun( p_best),
  		    l_currentValue = p_valueFun( p_current);

  		return ( l_bestValue === p_bestFun( l_bestValue, l_currentValue)) ? p_best: p_current;
  	  });
    };

    /**********************************************************************************

    closer_field:
    ***********************************************************************************/
    _.fn_plucker = function fn_plucker( p_closer_field){
  	  return function fn_plucker_return( p_obj){
  	    return (p_obj && p_obj[p_closer_field]);
  	  };
    };

    _.fn_best = function fn_best( p_fun, p_coll){
  	  ////console.log( 'best_p_coll:', p_coll);
  	  return _.reduce( p_coll, function fn_best_return_reduce_in( p_x, p_y){
  		 ////console.log( 'best_reduce_p_x:', p_x);
  		 ////console.log( 'best_reduce_p_y:', p_y);
  		 return p_fun( p_x, p_y) ? p_x : p_y;
  	  });
    };

    /**********************************************************************************
    설정된 클로저 값과 바인딩된 함수의 실행시 넘겨진 인자를 합하는 함수
    p_closer_captured: 첫 실행시 캡쳐된 클로저 변수와 바인딩된 함수의 실행시 넘겨진 free인자와 합친다.
    ***********************************************************************************/
    _.fn_makeAdder = function fn_makeAdder( p_closer_captured){
  	  ////console.log('CAPTURED:',p_closer_captured);
  	  return function fn_makeAdder_return( p_free){
  	    ////console.log('p_free:',p_free);
  	    return p_free + p_closer_captured;
  	  };
    };

    /**********************************************************************************
    반복함수[1]
    p_times: 반복 횟수를 결정하는 인자
    p_closer_value: 반복되는 동작 수행 값
    ***********************************************************************************/
    _.fn_repeat = function fn_repeat( p_times, p_closer_value){
  	  return _.map( _.range( p_times), function( p_num){
  	    return p_closer_value + ( p_num + 1);
  	  });
    };

    /**********************************************************************************
    반복함수[2]
    p_times: 반복 횟수를 결정하는 인자
    p_fun: 동작 수행 함수
    ***********************************************************************************/
    _.fn_repeatedly = function fn_repeatedly( p_times, p_fun){
  	  var returnRange =  _.range(p_times),
  	      returnVal =  _.map( returnRange, p_fun);
  	  //console.log( 'returnRange:', returnRange);
  	  //console.log( 'returnVal:', returnVal);
  	  return returnVal;
    };

    /**********************************************************************************
    반복함수[3]
    p_fun: 동작 수행 함수
    p_check: 결과가 'STOP'이면 false를 반환하는 결과를 확인하는 함수(이 함수의 반환값이 반복 횟수를 결정한다.)
    ***********************************************************************************/
    _.fn_iterateUntil = function fn_iterateUntil( p_fun, p_check, p_init){
  	  var l_ret = [],
  	      l_result = p_fun( p_init);

  	  while ( p_check( l_result)){
  		  l_ret.push( l_result);
  		  l_result = p_fun(l_result);
  	  }

  	  return l_ret;
    };

    /**********************************************************************************
    상수반환함수: 인자에 상관없이 항상 상수를 반환하는 함수임
    p_closer_value: 처음생성 시 설정한 상수 값.
    ***********************************************************************************/
    _.fn_always = function fn_always( p_closer_value){
  	  return function fn_always_return(){
  		  return p_closer_value;
  	  };
    };

    /**********************************************************************************
    자신을 호출할 때 넘겨준 인자 closer_method를 사용하는 어떤 함수를 반환하는 함수(closer함수)
    p_closer_name: 동작 수행 내부함수이름
    p_closer_method: target의 내부함수가 closer_method와 일치하는지 여부를 확인하기 위한 인자
    ***********************************************************************************/
    _.fn_invoker = function fn_invoker( p_closer_name, p_closer_method){
  	  //console.log( 'fn_invoker_p_closer_name:', p_closer_name);
  	  //console.log( 'fn_invoker_closer_method:', p_closer_method);
  	  return function fn_invoker_return( p_target /*인자...*/){
  		  //console.log( 'fn_invoker_return_p_target:', p_target);
  		  //console.log( 'fn_invoker_return_arguments:', arguments);
  		  //console.log( 'fn_invoker_return_p_closer_name:', p_closer_name);
  	      //console.log( 'fn_invoker_return_p_closer_method:', p_closer_method);
  		  if( !_.fn_existy( p_target)){
  			  _.fn_fail( "Must provide a target");
  		  }

  		  var l_targetMethod = p_target[p_closer_name],
  		      l_args = _.rest( arguments);
  		  //console.log( 'fn_invoker_return_l_targetMethod:',l_targetMethod);
  		  //console.log( 'fn_invoker_return_l_args:',l_args);
  		  //console.log( '_.fn_existy( l_targetMethod):', _.fn_existy( l_targetMethod));
  		  //console.log( 'p_closer_method === l_targetMethod:', p_closer_method === l_targetMethod);
  		  return _.fn_doWhen( ( _.fn_existy( l_targetMethod) && p_closer_method === l_targetMethod), function fn_invoker_return_fn_doWhen_in(){
  			  ////console.log('fn_invoker_fn_doWhen:', l_targetMethod.apply( p_target, l_args));
  			  return l_targetMethod.apply( p_target, l_args);
  		  });
  	  };
    };

    _.fn_rightAwayInvoker = function fn_rightAwayInvoker(){
  	var l_args  = _.toArray( arguments),
  	    l_method = l_args.shift(),
  		l_target = l_args.shift();

  		//console.log('fn_rightAwayInvoker_arguments:', arguments);
  		//console.log( 'fn_rightAwayInvoker_l_args:',l_args);
  		//console.log( 'fn_rightAwayInvoker_l_method:',l_method);
  		//console.log( 'fn_rightAwayInvoker_l_target:',l_target);
  		return l_method.apply( l_target, l_args);
    };
    /**********************************************************************************
    함수 호출 시 해당 'prefix'에 클로저 변수 값을 계속 1씩 추가하는 함수(실전사용?X)
    p_start: 클로져 변수의 시작 번호
    ***********************************************************************************/
    _.fn_makeUniqueStringFunction =  function fn_makeUniqueStringFunction( p_start){
  	   var closer_counter = p_start;
  	   return function fn_makeUniqueStringFunction_return( p_prefix){
  		  return [p_prefix, (closer_counter++)].join('');
  	   };
    };

    /**********************************************************************************
    e의 값이 null, undefined인 경우 기본값(arguments의 두번째인자부터해당하는 값) 설정해주는 함수
    p_fun: 리턴시 실행할 함수(메소드)
    ***********************************************************************************/
    _.fn_fnull =  function fn_fnull( p_fun /* , 기본값*/){
  	   var closer_defaults = _.rest( arguments);
  	   //console.log( 'fn_fnull_closer_defaults:', closer_defaults);
  	   //console.log( 'fn_fnull_arguments:', arguments);
  	   //console.log( 'fn_fnull_p_fun:', p_fun);
  	   return function fn_fnull_return( /* 인자*/){
  	     //console.log( 'fn_fnull_return_arguments:', arguments);
  		  var l_args = _.map( arguments, function( p_e, p_i){
  			  //console.log( 'fn_fnull_return_map_arguments:', arguments);
  			  //console.log( 'fn_fnull_return_p_e:', p_e);
  			  //console.log( 'fn_fnull_return_p_i:', p_i);
  			 return _.fn_existy( p_e) ? p_e: closer_defaults[p_i];
  		  });

  		  //console.log( 'fn_fnull_return_args:', l_args);


  		  return p_fun.apply( null, l_args);
  	   };
    };

    /**********************************************************************************
    기본값 셋팅 시 실행하는 함수
    p_default: 기본값에 해당하는 인자
    ***********************************************************************************/
    _.fn_defaults =  function fn_defaults( p_default){
  	  //console.log( 'fn_defaults_p_default:', p_default);
  	   return function fn_defaults_return( p_obj, p_key){
  		  //console.log( 'fn_defaults_return_p_obj:', p_obj);
  		  //console.log( 'fn_defaults_return_p_key:', p_key);
  		  //console.log( 'fn_defaults_return_p_default[p_key]:', p_default[p_key]);
  		  var l_val = _.fn_fnull( _.identity, p_default[p_key]);
  		  //console.log( 'fn_defaults_return_l_val:', l_val);
  		  //console.log( 'fn_defaults_return_p_obj[p_key]:', p_obj[p_key]);
  		  //console.log( 'fn_defaults_return_l_val( p_obj[p_key]):', l_val( p_obj[p_key]));
  			 return p_obj && l_val( p_obj[p_key]);
  	   };
    };

    /**************************************************************************************
    fn_checker(): 바인딩 시(처음 함수 호출 실행 시) 넘겨진 인자들을 통해 validation리스트를 생성한다.
    fn_checker_return(): 바인딩 후 호출 시 넘겨진 객체(p_obj)를 통해 p_obj가 클로저변수인 validation리스트에
                         부합하는지를 검증한다.
    **************************************************************************************/
    _.fn_checker =  function fn_checker( /*검증자*/){
  	  var closer_validators = _.toArray( arguments);
  	  //console.log( 'fn_checker_arguments:', arguments);
  	  //console.log( 'fn_checker_closer_validators:', closer_validators);
  	   return function fn_checker_return( p_obj){
  		  //console.log( 'fn_checker_obj:', p_obj);
  			 return _.reduce( closer_validators, function fn_checker_return_reduce_in( p_errs, p_check){
  				 //console.log( 'fn_checker_p_errs:', p_errs);
  				 //console.log( 'fn_checker_p_check:', p_check);
  				 if( p_check( p_obj)){
  					 return p_errs;
  				 }else{
  					 return _.chain( p_errs).push( p_check.message).value();
  				 }
  			 }, []);
  	   };
    };

    /**************************************************************************************
    fn_validator(): 바인딩 시(처음 함수 호출 실행 시) 넘겨진 인자들을 통해 검증에 해당하는 클로저 함수 객체를 생성한다.
                     [p_message]: 바인딩 함수객체 생성 시 속성으로 메세지를 생성할 때 적용되는 메세지
  				   [p_fun]: 바인딩 함수객체 생성 시 검증 체크를 실행하는 함수
    fn_validator_return(): 바인딩 후 호출 시 넘겨진 인자가 p_fun에 부합하는지 여부를 체크한다.
    **************************************************************************************/
    _.fn_validator = function fn_validator( p_message, p_fun){
  	  var closer_fun = function fn_validator_return( /*인자*/){
  		  //console.log('fn_validator_f_arguments:',arguments);
  		  //console.log('p_fun.apply( p_fun, arguments):',p_fun.apply( p_fun, arguments));
  		return p_fun.apply( p_fun, arguments);
  	  };

  	  closer_fun['message'] = p_message;
  	  //console.log('fn_validator_closer_fun:', closer_fun);
  	  //console.log('fn_validator_arguments:', arguments);
  	  return closer_fun;
    };

    /**************************************************************************************
    fn_hasKeys(): 바인딩 시(처음 함수 호출 실행 시) 넘겨진 인자들을 통해 검증 key에 해당하는 배열을 생성한다.
                     [closer_keys]: 검증 key 배열이 담겨진 클로저 변수
    fn_hasKeys_return(): 바인딩 후 호출 시 넘겨진 객체(p_obj)를 통해 obj의 key가 'closer_keys'에 해당하는지
                         체크한다.
    **************************************************************************************/
    _.fn_hasKeys = function fn_hasKeys(){
  	  var closer_keys = _.toArray( arguments);
  	  //console.log( 'fn_hasKeys_arguments:',arguments);
  	  //console.log( 'fn_hasKeys_closer_keys:',closer_keys);
  	  var closer_fun = function fn_hasKeys_return( p_obj){
  		  //console.log( 'fn_hasKeys_obj:',p_obj);
  		  return _.every( closer_keys, function fn_hasKeys_return_every_in( p_key){
  			  //console.log( 'fn_hasKeys_p_key:', p_key);
  			  //console.log( '_.has( p_obj, p_key):', _.has( p_obj, p_key));
  			  return _.has( p_obj, p_key);
  		  });
  	  };

  	  closer_fun.message = _.fn_cat( [ "Must have values for keys:"], closer_keys).join(' ');
  	  return closer_fun;
    };

    _.fn_dispatch = function fn_dispatch( /* funs*/){
  	  //console.log( 'fn_dispatch 시작');
  	  var closer_funs = _.toArray( arguments),
  	      closer_size = closer_funs.length;

  	  //console.log( 'fn_dispatch_arguments:',arguments);
  	  //console.log( 'fn_dispatch_closer_funs:',closer_funs);
  	  //console.log( 'fn_dispatch_closer_size:',closer_size);

  	  return function fn_dispatch_return( p_target /*, args*/){
  		  //console.log( 'fn_dispatch_return_p_target:',p_target);
  		  //console.log( 'fn_dispatch_return_arguments:',arguments);
  		  var l_ret = undefined,
  		      l_args = _.rest( arguments),
  			  l_funIndex = 0,
  			  l_fun;

  		  //console.log( 'fn_dispatch_return_l_args:',l_args);

  		  for(; l_funIndex <  closer_size; l_funIndex += 1){
  			  l_fun = closer_funs[ l_funIndex];
  			  l_ret = l_fun.apply( l_fun, _.fn_construct( p_target, l_args));

  			  //console.log( 'fn_dispatch_return_l_fun:',l_fun);
  			  //console.log( 'fn_dispatch_return_l_ret:',l_ret);
  			  //console.log( 'fn_dispatch_return_fn_construct( p_target, l_args):', _.fn_construct( p_target, l_args));
  			  if( _.fn_existy( l_ret)){
  				  return l_ret;
  			  }
  		  }

  		  return l_ret;
  	  };
    }

    _.fn_stringReverse = function fn_stringReverse( p_string){
  	  if( !_.isString( p_string)){
  		  //console.log( 'fn_stringReverse_p_string_undefined', p_string);
  		  return undefined;
  	  }
  	  //console.log( 'fn_stringReverse_p_string:', p_string);
  	  //console.log( "fn_stringReverse_p_string.split(''):", p_string.split(''));
  	  //console.log( "fn_stringReverse_p_string.split('').reverse():", p_string.split('').reverse());
  	  return p_string.split('').reverse().join("");
    };

    _.fn_aMap = function fn_aMap( p_obj){
  	  //console.log( 'fn_aMap_p_obj:', p_obj);
  	  //console.log( 'fn_aMap_arguments:', arguments);
  	  return _.isObject(p_obj);
    };

    _.fn_condition = function fn_condition( /* validator*/){
  	  var closer_validators = _.toArray( arguments);
  	   //console.log('fn_condition_closer_validators:', closer_validators);
  	  return function fn_condition_return( fun, arg){
  	    //console.log( 'fn_condition_return_fun:', fun);
  		//console.log( 'fn_condition_return_arg:', arg);
  		var errors = _.fn_mapcat( function(  isValid){
  		  //console.log( 'isValid:', isValid);
  		  //console.log( 'isValid( arg):', isValid( arg));
  		  return isValid( arg) ? [] : [isValid.message];
  	    }, closer_validators);
  		//console.log( 'errors:', errors);
  		if( !_.isEmpty( errors)){
  		  throw new Error( errors.join(', '));
  		}

  		return fun( arg);
  	};
    };

    _.fn_partial1 = function fn_partial1( fun, arg1){
  	//console.log('fn_partial1_fun:', fun);
  	//console.log('fn_partial1_arg1:', arg1);
  	return function fn_partial1_return( /*args*/){
  	  //console.log('fn_partial1_return:', arguments);
  	  var args = _.fn_construct( arg1, arguments);
  	  //console.log( 'fn_partial1_args:', args);
  	  return fun.apply( fun, args);
  	};
    };

    _.fn_partial2 = function fn_partial2( fun, arg1, arg2){
  	  //console.log( 'fn_partial2:', fun,arg1, arg2);
  	return function fn_partial2_return( /* args*/){
  	  var args = _.fn_cat( [ arg1, arg2], arguments);
  	  return fun.apply( fun, args);
      };
    };

    _.fn_partial3 = function fn_partial3( fun /*, args*/){
  	var pargs = _.rest( arguments);

  	return function fn_partial3_return( /* arguments*/){
  	  var args = _.fn_cat( pargs, _.toArray(arguments));
  	  return fun.apply( fun, args);
  	};
    };

    _.fn_splat = function fn_splat( p_closer_fun){
      return function( p_array){
  		return p_closer_fun.apply( null, p_array);
  	};
    };

    _.fn_curry = function fn_curry( fun){
      //console.log('curry_fun:', fun);
  	return function(){
  	  //console.log('curry_args:', arguments);
  	  return fun( arguments[0], arguments[1])
      };
    };

    _.fn_curry2 = function fn_curry2( fun){
      //console.log('curry_fun:', fun);
      return function( secondArg){
      //console.log('curry_args:', secondArg);
        return function( firstArg){
  	    return fun( firstArg, secondArg)
  	  };
  	};
    };

    _.fn_curry3 = function fn_curry3( fun){
      return function( last){
  	//console.log( 'last:', last);
  	  return function( middle){
  	  //console.log( 'middle:', middle);
  	    return function( first){
  		  //console.log( 'first:', first);
  		  return fun(first, middle, last);
  		};
  	  };
  	};
    };

    /**************************************************************************************
    fn_nexts(): 첫번째 인수 정보를 두번째 인수 정보와 비교하여 매칭되는 값을 배열로 묶어서 리턴한다.
                재귀함수를 이용하여 'p_graph' 다중 배열의 length가 '0'이 될때까지 실행한다.
                 인자:[p_graph]: 검사 값( 다중 배열)
  				   [p_node]: 비교 대상 값
  			로컬변수:[l_pair]: p_graph의 첫번째 배열
  				   [l_from]: l_pair의 첫번째 값
  				   [l_to]: l_pair의 두번째 값
  				   [l_more]: p_graph의 첫번째 배열을 뺀 나머지 배열 값들.
    **************************************************************************************/
    _.fn_nexts = function fn_nexts( p_graph, p_node, p_num){
       //console.log('nexts_p_num:', p_num);
        if( _.isNull( p_num) || _.isUndefined( p_num)){
          p_num = 0;
  	  }

  	  if( _.isEmpty( p_graph)){
  	     //console.log' p_graph.length:', 0);
  		  return [];
  	  }

  	  var l_pair = _.first( p_graph),
  	      l_from = _.first( l_pair),
  		  l_to = _.fn_second( l_pair),
  		  l_more = _.rest( p_graph);
  		 //console.log('nexts_p_graph:', p_graph);
  		 //console.log('nexts_p_node:', p_node);
  		 //console.log('nexts_l_pair:', l_pair);
  		 //console.log('nexts_l_from:', l_from);
  		 //console.log('nexts_l_to:', l_to);
  		 //console.log('nexts_l_more:', l_more);



  	  if( _.isEqual( p_node, l_from)){
  		p_num++;
  	   //console.log'equal[' + p_num + ']');
  		var l_construct = _.fn_construct( l_to, _.fn_nexts( l_more, p_node, p_num));
  	//console.log'equal[' + p_num + ']_l_construct:',l_construct);
  		return l_construct;
  	  }else{
  		p_num++;
  	//console.log'nonequal[' + p_num + ']');
  		var l_nexts = _.fn_nexts( l_more, p_node, p_num);
  	//console.log'nonequal[' + p_num + ']_l_nexts:', l_nexts);
  		return l_nexts;
  	  }
    };

    _.fn_depthSearch = function fn_depthSearch( p_graph, p_nodes, p_seen, p_num){
  	 //console.log('fn_depthSearch_p_graph:', p_graph);
  	 //console.log('fn_depthSearch_p_nodes:', p_nodes);
  	 //console.log('fn_depthSearch_p_seen:', p_seen);
  	 //console.log('fn_depthSearch_p_num:', p_num);
        if( _.isNull( p_num) || _.isUndefined( p_num)){
          p_num = 0;
  	  }

  	  if( _.isEmpty( p_nodes)){
  		  return _.g_rev( p_seen);
  	  }

  	 //console.log('_.g_rev:', _.g_rev);

  	  var l_node = _.first( p_nodes),
  	      l_more = _.rest( p_nodes);

  	  p_num++;
  	 //console.log('fn_depthSearch_l_node[' + p_num + ']:', l_node);
  	 //console.log('fn_depthSearch_l_more[' + p_num + ']:', l_more);
  	  var l_contains = _.contains( p_seen, l_node);
  	  if( l_contains){
  		 //console.log'fn_depthSearch_no_contains:', l_contains);
  		 //console.log'fn_depthSearch_no_contains_p_graph:', p_graph);
  		 //console.log'fn_depthSearch_no_contains_l_more:', l_more);
  		 //console.log'fn_depthSearch_no_contains_p_seen:', p_seen);
  		 //console.log'fn_depthSearch_no_contains_p_num:', p_num);
  		  return fn_depthSearch( p_graph, l_more, p_seen, p_num);
  	  }else{
  		 //console.log'fn_depthSearch_yes_contains:', l_contains);
  		  var l_cat = _.fn_cat( _.fn_nexts(p_graph, l_node), l_more);
  		  var l_const = _.fn_construct( l_node, p_seen);
  		 //console.log'fn_depthSearch_yes_contains_p_graph:', p_graph);
  		 //console.log'fn_depthSearch_yes_contains_l_cat:', l_cat);
  		 //console.log'fn_depthSearch_yes_contains_l_const:', l_const);
  		  return fn_depthSearch( p_graph, _.fn_cat( _.fn_nexts(p_graph, l_node), l_more), _.fn_construct( l_node, p_seen), p_num);
  	  }
    };

    _.fn_andify = function fn_andify( /* closer_preds*/){
  	  var closer_preds = _.toArray( arguments);
  	  //console.log( 'fn_andify_closer_preds:', closer_preds);
  	  return function fn_andify_return( /* l_args*/){
  		var l_args = _.toArray( arguments);
  		  //console.log( 'fn_andify_return_l_args:', l_args);
  		var l_everything = function( ps, truth){
  				//console.log( 'l_everything_ps:', ps, _.first( ps));
  				//console.log( 'l_everything_truth:', truth);
  				//console.log( 'l_everything_arguments:', arguments);
  				if( _.isEmpty( ps)){
  					return truth;
  				}else{
  					return _.every( l_args, _.first( ps)) && l_everything( _.rest( ps), truth);
  				}
  			};

  		return l_everything( closer_preds, true);
  	  };
    };

    /**************************************************************************************
    fn_orify(): 선언 시 체크함수들을 인자로 받아 배열화 시킨 후 체크 대상 값을 재귀함수를 사용하여 체크함수를 실행
                체크함수 해당 결과 중 1개라도 true인 경우 true를 리턴한다.

            선언시 인자:[closer_preds]: 검사 함수(넘어온 인자들을 배열로 변경시킴)
  			로컬변수:[l_args]: 체크를 필요로하는 대상값(넘어온 인자들을 배열로 변경시킴)
  				   [l_something]: 체크함수를 실행할 재귀함수
  				   [p_ps]: 재귀함수 호출 시의 체크함수 배열
  				   [p_truth]: 재귀함수 호출 시의 true or false 값
              [사용 underscore함수]
                - _.toArray: 인자가 배열인 경우 배열로, String인 경우 한글자씩 배열로, 객체인경우 객체의 value만 배열로,
                             arguments인 경우 인자를 배열로 변경시키는 작업을 수행한다. 빈값인 경우 빈배열
                _ _.some: 첫번째인자로 체크할 값(배열 혹은 객체를 받음 객체인 경우 value를 배열화함)을 넘기고
                          두번째인자로 체크할 함수를 받음
                          첫번째인자의 체크하 여러개중에 1개라도 체크함수에 해당하는 경우 true를 리턴, 전부다 false일 때만 false리턴함
    **************************************************************************************/
    _.fn_orify = function fn_orify( /* closer_preds*/){
  	  var closer_preds = _.toArray( arguments);
  	   //console.log( 'fn_orify_closer_preds:', closer_preds);
  	  return function fn_orify_Return( /* args*/){
  		  var l_args = _.toArray( arguments);
  		  //console.log( 'fn_orify_Return_l_args:', l_args);
  		  var l_something = function( p_ps, p_truth){
  			    //console.log( 'l_something_p_ps:', p_ps, _.first( p_ps));
  				//console.log( 'l_something_p_truth:', p_truth);
  				//console.log( 'l_something_arguments:', arguments);
  			  if( _.isEmpty( p_ps)){
  				  //console.log( 'l_something_isEmpty: true');
  				  return p_truth;
  			  }else{
  				  //console.log( 'l_something_isEmpty: false');
  				  return _.some( l_args, _.first( p_ps)) || l_something( _.rest( p_ps), p_truth);
  			  }
  		  };

  		  return l_something( closer_preds, false);
  	  };
    };

    _.fn_deepClone = function fn_deepClone( p_obj){
  	  if( !_.fn_existy( p_obj) || !_.isObject( p_obj)){
  		  return p_obj;
  	  }

  	  var l_temp = new p_obj.constructor();
  	  //console.log( 'fn_deepClone_l_temp:', l_temp);

  	  for( var key in p_obj){
  		  if( p_obj.hasOwnProperty( key)){
  			  //console.log( 'fn_deepClone_key:', key);
  			  //console.log( 'fn_deepClone_p_obj[ key]:', p_obj[ key]);
  			  l_temp[ key] = fn_deepClone( p_obj[ key]);
  		  }
  	  }

  	  return l_temp;
    };

    _.fn_visit = function fn_visit( p_mapFun, p_resultFun, p_array){
  	  if( _.isArray( p_array)){
  		  return p_resultFun( _.map( p_array, p_mapFun));
  	  }else{
  		  return p_resultFun( p_array);
  	  }
    };

    _.fn_flat = function fn_flat( p_array){
        //console.log('flat_p_array:', p_array);
  	  if( _.isArray( p_array)){
          var mapArray  = _.map( p_array, _.fn_flat);
          //console.log('_.map( p_array, flat):', mapArray);
  		return _.fn_cat.apply( _.fn_cat, mapArray);
  	  }else{
          return [ p_array];
  	  }
    };

    _.fn_randString = function fn_randString( p_len){
  	  //console.log( 'fn_randString_p_len:', p_len);
  	  var l_asciiArray = _.fn_repeatedly( p_len, _.fn_partial1( _.fn_partial1( _.random, 1), 26));
  	  console.log( 'fn_randString_l_asciiArray:', l_asciiArray);
  	  return _.map( l_asciiArray, function( n){

  	  }).join('');
    };

    _.fn_summ = function fn_summ( p_array){
  	  var l_result = 0,
  	      l_size = p_array.length;

  	  for(var i = 0; i < l_size; i = i + 1){
  		  l_result = l_result + p_array[i];
  	  }

  	  return l_result;
    };

    _.fn_summRec = function fn_summ( p_array, p_seed){
  	  if( _.isEmpty( p_array)){
  		  return p_seed;
  	  }else{
  		return _.fn_summRec( _.rest( p_array), _.first( p_array) + p_seed);
  	  }

    };

    _.fn_deepFreeze = function( p_obj){
  	  if( !Object.isFrozen( p_obj)){
  		  Object.freeze( p_obj);
  	  }

  	  for( var key in p_obj){
  		  if( !p_obj.hasOwnProperty( key) || !_.isObject( p_obj[key])){
  			  continue;
  		  }
  		  _.fn_deepFreeze( p_obj[key]);
  	  }
    };

    _.fn_merge = function fn_merge( /*args*/){
  	  var l_const = _.fn_construct( {}, arguments);
  	  console.log( 'merge_construct:', l_const);
  	  return _.extend.apply(null, l_const);
    };

    _.fn_dmsDepthFormAllSearch = function fn_dmsDepthFormAllSearch( p_closer_search){
       //console.log('fn_depthSearch_arguments:', arguments);
       //console.log('fn_depthSearch_p_closer_search:', p_closer_search);

        return function(/*arguments*/){
            var l_args = _.toArray(arguments);
            var closer_num = 0;

            var closer_idObj = {
                keyList: []
               ,formObjList: []
               ,typeObj: {}
               ,saveObj: {}
             };

            var returnDepthFormIdSearch = function( p_first){
                closer_num = closer_num + 1;
                var l_length = p_first.children.length,
                    l_children = p_first.children,
                    idObj = {};
                //console.log( 'fn_depthSearch_closer_num:', closer_num);
                //console.log( 'fn_depthSearch_arguments:', arguments);
                //console.log( 'fn_depthSearch_p_first:', p_first);
                //console.log( 'fn_depthSearch_p_first_child:', p_first.children);




               //console.log('fn_depthSearch_l_length:', l_length);
              //console.log('fn_depthSearch_l_children:', l_children);
               //console.log('fn_depthSearch_p_first[p_closer_search]):', p_first[p_closer_search]);

                if(l_length === 0){
                   //console.log( "p_first['dataset']['role']:", p_first['dataset']['role'], p_first[p_closer_search]);
                    if(p_first['dataset']['role'] === 'button' || p_first['nodeName'].toLowerCase() === 'span' || p_first['nodeName'].toLowerCase() === 'a' || p_first['nodeName'].toLowerCase() === 'img'){
                        return closer_idObj;
                    }

                    if( !_.isNull( p_first[p_closer_search]) && !_.isUndefined( p_first[p_closer_search]) && !_.isEmpty( p_first[p_closer_search])){
                        idObj = {};
                        idObj[p_closer_search] = p_first[p_closer_search];

                        if( _.isNull( p_first['dataset']['role']) || _.isUndefined( p_first['dataset']['role']) || _.isEmpty( p_first['dataset']['role'])){
                            idObj['type']  = p_first['nodeName'].toLowerCase();
                        }else{
                            idObj['type']  = p_first['dataset']['role'];

                        }

                        if(idObj['type'] === "extmaskeddatepicker" || idObj['type'] === "datepicker"){
                            idObj['value'] = $('#' + p_first[p_closer_search]).data("kendoDatePicker").value();
                        }else{
                            idObj['value'] = p_first.value;
                        }

                        closer_idObj.saveObj[p_first[p_closer_search]] = idObj['value'];

                       //console.log('idObj:', idObj);


                        if(!closer_idObj.typeObj.hasOwnProperty(p_first['dataset']['role'])){
                            if( _.isNull( p_first['dataset']['role']) || _.isUndefined( p_first['dataset']['role']) || _.isEmpty( p_first['dataset']['role'])){
                                if(p_first['nodeName'] === 'INPUT'){
                                    closer_idObj.typeObj[p_first['nodeName'].toLowerCase()] = '';
                                }else{
                                    closer_idObj.typeObj[p_first['dataset']['role']] = '';
                                }
                            }else{
                                closer_idObj.typeObj[p_first['dataset']['role']] = '';
                            }

                        }

                        closer_idObj.keyList.push( p_first[p_closer_search]);
                        closer_idObj.formObjList.push(idObj);
                     //console.log'#################################id:', p_first[p_closer_search]);
                    }
                }else{
                    if(p_first['dataset']['role'] === 'extgrid' || p_first['className'] === 'table_grid' || p_first['dataset']['role'] === 'grid'){
                        return closer_idObj;
                    }
                }

                if( _.isNull( l_children) || _.isUndefined( l_children) ||  _.isEmpty( l_children)){
                   //console.log'child is null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    return closer_idObj;
                }else{
                   //console.log'child is exist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    _.map( l_children, returnDepthFormIdSearch);
                }

               //console.log('closer_idObj:', closer_idObj);
                //return _.fn_cat.apply( _.fn_cat, _.map( l_children, returnDepthFormIdSearch););
                //return _.map( l_children, returnDepthFormIdSearch);
                return closer_idObj;
            };
            if( !_.isNull( l_args[0].length) && !_.isUndefined( l_args[0].length) && !_.isEmpty( l_args[0].length)){
                alert('Form Id를 정확히 입력해주세요.');
            }else{
                return returnDepthFormIdSearch( l_args[0]);
            }
        };
    };

    _.fn_dmsDepthFormIdSearch = function fn_dmsDepthFormIdSearch( p_closer_search){
        return function(/*arguments*/){
            var l_args = _.toArray(arguments);
            var closer_num = 0;

            var closer_idObj = {
                    keyList: []
                   ,formObjList: []
                };

            var returnDepthFormIdSearch = function( p_first){
                closer_num = closer_num + 1;
                var l_length = p_first.children.length,
                    l_children = p_first.children,
                    idObj = {};

               //console.log('fn_depthSearch_l_children:', l_children);

                if(l_length === 0){
                   //console.log( "p_first['dataset']['role']:", p_first['dataset']['role'], p_first[p_closer_search]);
                    if(p_first['dataset']['role'] === 'button' || p_first['nodeName'].toLowerCase() === 'span' || p_first['dataset']['role'] === 'upload'
                  	 || p_first['nodeName'].toLowerCase() === 'a' || p_first['nodeName'].toLowerCase() === 'img'){
                    	//console.log('closer_idObj6:', closer_idObj);
                        return closer_idObj;
                    }

                    if( !_.isNull( p_first[p_closer_search]) && !_.isUndefined( p_first[p_closer_search]) && !_.isEmpty( p_first[p_closer_search])){
                        idObj = {};
                        
                        idObj['class'] = p_first['className'];
                        if(p_first['className'] === 'i_radio'){
                      	  var keyLen = closer_idObj.keyList.length;
                      	  //var _.map( closer_idObj.keyList, )
                      	  for( var i = 0; i < keyLen; i = i + 1){
                      		  if( closer_idObj.keyList[i] === p_first['name']){
                      			 console.log('이미존재함!:', p_first['name']);
                      			 //console.log('closer_idObj7:', closer_idObj);
                      			  return closer_idObj;
                      		  }
                      	  }
                      	  idObj[p_closer_search] = p_first['name'];
                      	  idObj['type']  = 'radio';
                      	  idObj['value'] = '';

                      	  closer_idObj.keyList.push( p_first['name']);
                        }else{

                      	  if( _.isNull( p_first['dataset']['role']) || _.isUndefined( p_first['dataset']['role']) || _.isEmpty( p_first['dataset']['role'])){
                      		  if( p_first['type'] === 'checkbox'){
                          		idObj['type']  = 'checkbox';
  	                       	  }else{
  	                       		idObj['type']  = p_first['nodeName'].toLowerCase();
  	                       	  }

                            }else{
                         		  idObj['type']  = p_first['dataset']['role'];
                            }
                      	  
                      	  idObj[p_closer_search] = p_first[p_closer_search];

                      	  closer_idObj.keyList.push( p_first[p_closer_search]);

                      	  if(idObj['type'] === "extmaskeddatepicker" || idObj['type'] === "datepicker"){
                                idObj['value'] = $('#' + p_first[p_closer_search]).data("kendoDatePicker").value();
                            }else{
                                idObj['value'] = p_first.value;
                            }
                        }

                       //console.log('idObj:', idObj);
                        closer_idObj.formObjList.push(idObj);
                     //console.log'#################################id:', p_first[p_closer_search]);
                    }
                }else{
              	  if(p_first['dataset']['role'] === 'extgrid' || p_first['className'] === 'table_grid' || p_first['dataset']['role'] === 'grid'){
              		//console.log('closer_idObj8:', closer_idObj);
                        return closer_idObj;
                    }
                }

                if( _.isNull( l_children) || _.isUndefined( l_children) ||  _.isEmpty( l_children)){
                    //console.log('child is null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    //console.log('closer_idObj9:', closer_idObj);
                    return closer_idObj;
                }else{
                    //console.log('child is exist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    _.map( l_children, returnDepthFormIdSearch);
                }

                //console.log('closer_idObj10:', closer_idObj);
                //return _.fn_cat.apply( _.fn_cat, _.map( l_children, returnDepthFormIdSearch););
                //return _.map( l_children, returnDepthFormIdSearch);
                return closer_idObj;
            };
            if(  l_args.length !== 1){
                alert('Form Id를 정확히 입력해주세요.');
                return false;
            }else{
                return returnDepthFormIdSearch( l_args[0]);
            }
        };
     };

    _.fn_dmsInit = function fn_dmsInit( p_dataset){
        try{
            var datasetLen = 0,
                rowData = {},
                rowIdObj = {},
                dataType,
                clsChk;

            if( _.isNull( p_dataset) || _.isUndefined( p_dataset) ||  _.isEmpty( p_dataset)){
                throw{
                    name: "DATA_SET ERROR"
                   ,message: "데이터 셋을 확인해주세요."
                   ,extra: "check your dateaset![p_dataset]"
                };
            }else{
                datasetLen = p_dataset.length;
                
                for( var i = 0; i < datasetLen; i = i + 1 ){
                    rowData = p_dataset[i];
                    if(!rowData.hasOwnProperty('type') || !rowData.hasOwnProperty('id')){
                        throw{
                            name: "DATA_ROW ERROR"
                           ,message: "데이터 셋을 확인해주세요. [type, id] 속성은 필수입니다."
                           ,extra: "check your dateaset![p_dataset]"
                        };
                    }else{
                        dataType = rowData.type;
                        clsChk = rowData.class;
                        
                        if( dataType === 'input'){
                      	  rowIdObj = $('#' + rowData.id)[0];
                        }else if( dataType === 'radio'){
                      	  rowIdObj = $('[name="' + rowData.id + '"]')[0];
                        }else{
                      	  rowIdObj = $('#' + rowData.id);
                        }
                        
                        switch (dataType) {
                            case "maskeddatetimepicker":
                                rowIdObj.data("kendoDateTimePicker").value( '');
                                break;
                            case "datepicker":
                          	  //console.log('datepicker rowIdObj:', rowIdObj);
                                rowIdObj.value = '';
                                rowIdObj.data("kendoDatePicker").value('');
                                break;
                            case "multiselectdropdownlist":
                                rowIdObj.data("kendoMultiSelectDropDownList").value( []);
                                break;
                            case "dropdownlist":
                                rowIdObj.data("kendoDropDownList").value( '');
                                break;
                            case "numerictextbox":
                                rowIdObj.data("kendoNumericTextBox").value( '');
                                break;
                            case "input":
                            	if(clsChk === 'form_comboBox'){
                         		   rowIdObj = $('#' + rowData.id);
                     			   rowIdObj.data("kendoExtDropDownList").value('');
                     		    } else if(clsChk === 'form_numeric'){
                     			   rowIdObj = $('#' + rowData.id);
                     			   rowIdObj.data('kendoExtNumericTextBox').value('');
                     		    } else if(clsChk === 'form_datepicker' || clsChk === 'form_datepicker ac'){
                     			   rowIdObj = $('#' + rowData.id);
                     			   rowIdObj.data("kendoExtMaskedDatePicker").value('');
                     		    } else {
                     		    	rowIdObj.value = '';
                     		    }
                                break;
                            case "autocomplete":
                                rowIdObj.data("kendoAutoComplete").value( '');
                                break;
                            case "textarea":
                                rowIdObj.val( '');
                                break;
                            case "maskeddatepicker":
                                rowIdObj.data("kendoDatePicker").value( '');
                                break;
                            case "colorpicker":
                                rowIdObj.data("kendoColorPicker").value( '#ffffff');
                                break;
                            case "checkbox":
                          	  rowIdObj.prop("checked",false);
                                break;
                            case "radio":
                                $("input[name='" + rowData.id + "']:radio:input[value=N]").prop("checked", true);
                                break;
                            case "button":
                            	break;
                            case "div":
                            	break;
                            default:
                                throw{
                                    name: "DATA_ROW TYPE ERROR"
                                   ,message: "데이터 셋을 확인해주세요. [type] 속성 확인이 필요합니다."
                                   ,extra: "check your dateaset![p_dataset]"
                                };
                            }
                    }

                }

            }
        }catch(e){
            alert('초기화 중 에러! 확인해주세요.');
           console.log('e:', e);
        }
    };

    _.fn_dmsSave = function fn_dmsSave( closer_dataset, p_formId, p_exceptIdObj, p_dateType){
         /*******************************************************************************
          *
          * p_dateType: 날짜 값 설정에 대한 유형으로 'date', '-', '/', null(undefined)
          *             ['date']: 날짜값을 그대로 설정함.
          *             ['-']: YYYY-MM-YY 값으로 설정함
          *             ['/']: YYYY/MM/YY 값으로 설정함
          *             [null or undefined or '']: YYYYMMYY 값으로 설정함
          *******************************************************************************/
         var l_args = _.toArray(arguments);
         var closer_num = 0;

         var closer_idObj = {};

         if( _.isNull( p_exceptIdObj) || _.isUndefined( p_exceptIdObj) ||  _.isEmpty( p_exceptIdObj)){
      	   p_exceptIdObj = {};
         }

         var returnDepthFormIdSearch = function( p_first){
             closer_num = closer_num + 1;
             var l_length = p_first.children.length,
                 l_children = p_first.children,
                 l_type,
                 idObj = {};

             //console.log('fn_depthSearch_l_children:', l_children, p_first);

             if(l_length === 0){
          	  //console.log('p_first:', p_first);

          	   if(p_exceptIdObj.hasOwnProperty(p_first['id'])){
          		  //console.log('제외설정 ID!:', p_first['id']);
            		  return closer_idObj;
          	   }

          	   if(p_first['className'] === 'i_radio'){
          		  //console.log('###radio:', p_first, $('input[name="' + p_first['name'] + '"]:checked').val());
          		  //console.log('###radio2:', $('input[name="' + p_first['name'] + '"]:checked'));

               	  //var _.map( closer_idObj.keyList, )
               	  if(closer_idObj.hasOwnProperty(p_first['name'])){
               	     //console.log('이미존재함!:', p_first['name']);
               		  return closer_idObj;
               	  }

               	 if( _.include( closer_dataset, p_first['name'])){
               		closer_idObj[p_first['name']] = $('input[name="' + p_first['name'] + '"]:checked').val();
               	 }
                 }else{
              	   if( _.include( closer_dataset, p_first['id'])){
                         if( _.isNull( p_first['dataset']['role']) || _.isUndefined( p_first['dataset']['role']) || _.isEmpty( p_first['dataset']['role'])){

                             if( p_first['type'] === 'checkbox'){
                          	   l_type  = 'checkbox';
  	                       }else{
  	                           l_type  = p_first['nodeName'].toLowerCase();
  	                       }
                         }else{
                     		   l_type  = p_first['dataset']['role'];
                         }

                         if(l_type === "maskeddatepicker"|| l_type === "datepicker"){
                      	   if( _.isNull( p_dateType) || _.isUndefined( p_dateType) || _.isEmpty( p_dateType)){
                      		   p_dateType = '';
                      	   }

                      	   if(p_dateType === 'date'){
                      		   closer_idObj[p_first['id']] = new Date(p_first.value);
                      	   }else{
                      		   if( _.isNull( p_first.value) || _.isUndefined( p_first.value) || _.isEmpty( p_first.value)){
                      			   closer_idObj[p_first['id']] = '';
                      		   }else{
                      			   var strValue = p_first.value.replace(/[^\d]/g, '');

                      			   if( strValue.length === 8){
                      				   closer_idObj[p_first['id']] = strValue.substr(0,4) + p_dateType + strValue.substr(4,2) + p_dateType + strValue.substr(6,2);
                          		   }else {
                          			   closer_idObj[p_first['id']] = p_first.value;
                          		   }
                      		   }
                      	   }

                         }else if(l_type === 'checkbox'){
                      	  //console.log('###checkbox:', $("#" + p_first['id']).prop("checked"));
                      	   closer_idObj[p_first['id']] = $("#" + p_first['id']).prop("checked") == true ? "Y" : "N";
                         }else{
                             closer_idObj[p_first['id']] = p_first.value;
                         }
                     }else{
                         return closer_idObj;
                     }
                 }

             }else{
                 if(p_first['dataset']['role'] === 'extgrid' || p_first['className'] === 'table_grid'){
                     return closer_idObj;
                 }
             }

             if( _.isNull( l_children) || _.isUndefined( l_children) ||  _.isEmpty( l_children)){
                 console.log('child is null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                 return closer_idObj;
             }else{
                  console.log('child is exist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                 _.map( l_children, returnDepthFormIdSearch);
             }

            //console.log('closer_idObj:', closer_idObj);
             //return _.fn_cat.apply( _.fn_cat, _.map( l_children, returnDepthFormIdSearch););
             //return _.map( l_children, returnDepthFormIdSearch);
             return closer_idObj;
         };
         if(  l_args.length < 2){
             alert('Form Id를 정확히 입력해주세요.');
         }else{
             return returnDepthFormIdSearch( l_args[1]);
         }
    };

    _.fn_dmsSaveDataset = function fn_dmsSave( closer_dataset, p_exceptIdObj){

        var l_args = _.toArray(arguments);
        var closer_num = 0;

        var closer_idObj = {};

        if( _.isNull( p_exceptIdObj) || _.isUndefined( p_exceptIdObj) ||  _.isEmpty( p_exceptIdObj)){
     	   p_exceptIdObj = {};
        }

        var returnDepthFormIdSearch = function( p_first){
            closer_num = closer_num + 1;
            var l_length = p_first.children.length,
                l_children = p_first.children,
                l_type,
                idObj = {};

           //console.log('fn_depthSearch_l_children:', l_children);

            if(l_length === 0){
         	  //console.log('p_first:', p_first);

         	   if(p_exceptIdObj.hasOwnProperty(p_first['id'])){
         		  //console.log('제외설정 ID!:', p_first['id']);
           		  return closer_idObj;
         	   }

         	   if(p_first['className'] === 'i_radio'){
              	  //var _.map( closer_idObj.keyList, )
              	  if(closer_idObj.hasOwnProperty(p_first['name'])){
              	     //console.log('이미존재함!:', p_first['name']);
              		  return closer_idObj;
              	  }

              	 if( _.include( closer_dataset, p_first['name'])){
              		closer_idObj[p_first['name']] = p_first.value;
              	 }
                }else{
             	   if( _.include( closer_dataset, p_first['id'])){
                        if( _.isNull( p_first['dataset']['role']) || _.isUndefined( p_first['dataset']['role']) || _.isEmpty( p_first['dataset']['role'])){
                            l_type  = p_first['nodeName'].toLowerCase();
                        }else{
                            l_type  = p_first['dataset']['role'];
                        }

                        if(l_type === "maskeddatepicker"|| l_type === "datepicker"){
                            closer_idObj[p_first['id']] = new Date(p_first.value);
                        }else{
                            closer_idObj[p_first['id']] = p_first.value;
                        }
                    }else{
                        return closer_idObj;
                    }
                }

            }else{
                if(p_first['dataset']['role'] === 'extgrid' || p_first['className'] === 'table_grid'){
                    return closer_idObj;
                }
            }

            if( _.isNull( l_children) || _.isUndefined( l_children) ||  _.isEmpty( l_children)){
               //console.log'child is null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                return closer_idObj;
            }else{
               //console.log'child is exist!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                _.map( l_children, returnDepthFormIdSearch);
            }

           //console.log('closer_idObj:', closer_idObj);
            //return _.fn_cat.apply( _.fn_cat, _.map( l_children, returnDepthFormIdSearch););
            //return _.map( l_children, returnDepthFormIdSearch);
            return closer_idObj;
        };
        if(  l_args.length !== 2){
            alert('Form Id를 정확히 입력해주세요.');
        }else{
            return returnDepthFormIdSearch( l_args[1]);
        }
   };

   _.fn_dmsDataSet = function fn_dmsDataSet( p_keyList, p_dataset){
       try{
           var datasetLen = 0,
               rowData = {},
               rowIdObj = {},
               dataType,
               clsChk;

           if( _.isNull( p_keyList) || _.isUndefined( p_keyList) ||  _.isEmpty( p_keyList)){
               throw{
                   name: "DATA_KEY ERROR"
                  ,message: "데이터 키정보를  확인해주세요."
                  ,extra: "check your keyList![p_keyList]"
               };
           }

           if( _.isNull( p_dataset) || _.isUndefined( p_dataset) ||  _.isEmpty( p_dataset)){
               throw{
                   name: "DATA_SET ERROR"
                  ,message: "데이터 셋을 확인해주세요."
                  ,extra: "check your dateaset![p_dataset]"
               };
           }else{
               datasetLen = p_keyList.length;

               _.map(p_keyList, function (p_chkObj){

              	 if(p_dataset.hasOwnProperty(p_chkObj.id)){
              		 dataType = p_chkObj.type;
              		 clsChk = p_chkObj.class;
              		 
                       if( dataType === 'input'){
                     	  rowIdObj = $('#' + p_chkObj.id)[0];
                       }else if( dataType === 'radio'){
                     	  rowIdObj = $('[name="' + p_chkObj.id + '"]')[0];
                       }else{
                     	  rowIdObj = $('#' + p_chkObj.id);
                       }
                       
                       switch (dataType) {
                           case "maskeddatetimepicker":
                               rowIdObj.data("kendoDateTimePicker").value(new Date(p_dataset[p_chkObj.id]));
                               break;
                           case "datepicker":
                        	  if(dms.string.isEmpty(p_dataset[p_chkObj.id])){
                                  rowIdObj.data("kendoDatePicker").value("");
                          	  }else{
                          	      if(p_dataset[p_chkObj.id].constructor === Date){
                              		  rowIdObj.data("kendoDatePicker").value(p_dataset[p_chkObj.id]);
                            	  }else{
                            	      if(!_.isEmpty(p_dataset[p_chkObj.id])){
                                  	      var strValue = p_dataset[p_chkObj.id].replace(/[^\d]/g, '');

                                  	      if( strValue.length === 8){
                                              rowIdObj.data("kendoDatePicker").value(new Date(strValue.substr(0,4) + '-' + strValue.substr(4,2) + '-' + strValue.substr(6,2)));
                                  	      }else {
              	                  	          rowIdObj.data("kendoDatePicker").value(p_dataset[p_chkObj.id]);
              	                  	      }
                                      }
                            	  }
                          	  }
                              break;
                           case "multiselectdropdownlist":
                               rowIdObj.data("kendoMultiSelectDropDownList").value( p_dataset[p_chkObj.id]);
                               break;
                           case "dropdownlist":
                               rowIdObj.data("kendoDropDownList").value( p_dataset[p_chkObj.id]);
                               break;
                           case "numerictextbox":
                               rowIdObj.data("kendoNumericTextBox").value( p_dataset[p_chkObj.id]);
                               break;
                           case "input":
                        	   if(clsChk === 'form_comboBox'){
                        		   rowIdObj = $('#' + p_chkObj.id);
                    			   rowIdObj.data("kendoExtDropDownList").value(p_dataset[p_chkObj.id]);
                    		   } else if(clsChk === 'form_numeric'){
                    			   rowIdObj = $('#' + p_chkObj.id);
                    			   rowIdObj.data('kendoExtNumericTextBox').value(p_dataset[p_chkObj.id]);
                    		   } else if(clsChk === 'form_datepicker' || clsChk === 'form_datepicker ac'){
                    			   rowIdObj = $('#' + p_chkObj.id);
                    			   rowIdObj.data("kendoExtMaskedDatePicker").value(dms.date.getDateFormat(p_dataset[p_chkObj.id]));
                    		   } else {
                    			   rowIdObj.value = p_dataset[p_chkObj.id];
                    		   }
                               break;
                           case "autocomplete":
                        	   rowIdObj.data("kendoAutoComplete").value( p_dataset[p_chkObj.id]);
                               break;
                           case "textarea":
                               rowIdObj.val( p_dataset[p_chkObj.id]);
                               break;
                           case "maskeddatepicker":
                               rowIdObj.data("kendoDatePicker").value( new Date(p_dataset[p_chkObj.id]));
                               break;
                           case "colorpicker":
                               rowIdObj.data("kendoColorPicker").value( p_dataset[p_chkObj.id]);
                               break;
                           case "checkbox":
                         	     rowIdObj.prop("checked", p_chkObj.id == "Y" ? true : false);
                               break;
                           case "radio":
                               $("input[name='" + p_chkObj.id + "']:radio:input[value=" + p_dataset[p_chkObj.id] +"]").prop("checked", true);
                               break;
                           default:
                               throw{
                                   name: "DATA_ROW TYPE ERROR"
                                  ,message: "데이터 셋을 확인해주세요. [type] 속성 확인이 필요합니다."
                                  ,extra: "check your dateaset![p_dataset]"
                               };
                       }
              	 }

               });

           }
       }catch(e){
           alert('초기화 중 에러! 확인해주세요.');
          console.log('e:', e);
       }
   };

   _.g_isOdd = _.fn_complement( _.fn_isEven);
   _.g_zero  = _.fn_validator( "cannot be zero", function( n){ return 0 === n;});
   _.g_rev   = _.fn_dispatch( _.fn_invoker( 'reverse', ArrayProto.reverse), _.fn_stringReverse);
   _.g_formAllChk = _.fn_dmsDepthFormAllSearch( 'id');
   _.g_formIdChk = _.fn_dmsDepthFormIdSearch( 'id');
   _.g_rand  = _.fn_partial1( _.random, 1);

   _.LazyChain = function LazyChain( p_obj){
  	  this._calls = [];
       this._target = p_obj;
   };

   _.LazyChain.prototype.invoke = function( methodName /*, args*/){
  	  var args = _.rest( arguments);
  	  console.log('methodName:',  methodName);
  	  this._calls.push( function( target){
  		console.log('target:', target);
  		var meth = target[methodName];
  		console.log('meth:', meth);
  		return meth.apply( target, args);
  	  });

  	  return this;
   };

   _.LazyChain.prototype.force = function( ){
  	  return _.reduce( this._calls
  	                 , function( target, thunk){
  						 console.log( 'force_target:', target);
  						 console.log( 'force_thunk:', thunk);
  						 return thunk( target);
  	                   }
  				     , this._target
  					  );
   };

   _.LazyChain.prototype.tap = function( p_fun){
  	  console.log('p_fun:',  p_fun);
  	  this._calls.push( function( target){
  		console.log('target:', target);
  		p_fun(target);
  		return target;
  	  });

  	  return this;
   };

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());